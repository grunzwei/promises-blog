#this is a blog about promises in node.js
a blog about proper promises methodology
this blog exists as a repository in https://github.com/grunzwei-fresh/promises-blog and can be opened with https://beta.codefresh.com
you can read the blog in the README.md file and view the examples in the code editor, play with the terminal and run the examples via the run configurations area at the top, where a configuration exists per example.
the examples are modeled as tests, using the "mocha" test-runner utility.

#in this blog
we'll cover:
* async operations in node
* pain with callback standard
* promises
* promises chaining
* the libraries we use
* real life best practices that we've gathered for working with promises
* the common pitfalls we're aware of 
* tips and tricks
* how we test such code.

we'll start at the level of a node newbie and progress as things get more advanced.
our examples will be focused primarily on on mock "setTimeout" async examples, but we'll play with mongoose with mongodb and maybe node fs module.

#1. async programming in nodejs - standard node callbacks

the most basic way of handling async operations in node is by using callbacks, and that's what most libraries offer.
we invoke the function, the function performs some operation in an async manner and the callback that we passed as an argument is invoked with the result, allowing us to handle the result and continue our applicative flow.

note that in the asynchronous callback function, the first parameter is almost always an error.
if the function ran successfully, the error object is usually null or undefined.
any remaining arguments are in case of success and should only be regarded if the error object is falsy.

[a mock 3rd party library with asynchronous callbacks can be found at example 1](examples/example1.js)
[usage can be seen at example 2](examples/example2.js)

#2. pain

there are several problems with working in this fashion.
the most obvious are nesting levels, boilerplate and readability.

consider the following sum: 1+2+3+4+5.
[we have a go at example 3](examples/example3.js)

this is a trivial case, and OMG, the horror.
but now consider another issue. what if sum doesn't strictly agree with its supposed api?
what if the implementation of sum is buggy?
what if it sometimes throws an exception, even though it's not supposd to do that and should return an err parameter in the callback?

take the above example and wrap every sum invocation with try catch.

[you should get something like example 4](examples/example4.js)

ok, so it's bad, but at least it's over with!

but... it gets worse!

couldn't we have just used the one try catch around the first level and not needed the internal try catch blocks?
sum is an asynchronous function, and depending on its implementation you can't always try catch things.
in our case we wrote sum and it's mocky and trivial, but in real complex async code, sum could be comprised of
many 2nd/3rd party asynchronous functions, and any of those could be suffering from the following problem:

[bad try catch of async function in example 5](examples/example5.js)

output: uncaught exception occurred: you'll never catch me!

if you recall from earlier discussion we mentioned that asynchronous functions will be processed at a later time by the nodejs eventloop. that means that those functions run pretty much without context. they're registered - and that's it. so no try catch - which is in the "now". that execution flow is done with. when the async function is invoked, it's a completely different stack trace.
and yes, due to this, if you throw an exception in the async function you won't know where it's invoked from, usually, in the stacktrace.

#3. promises

to alleviate these issues, we have promises. they won't magically solve everything -
nothing can help you if an async 3rd party you use which doesn't try catch on an async function internally correctly - there's nothing you can do.
but with the right methodology you can make sure all your 2nd/1st party code is in the clear.

promises are compliant to the [Promises/A+ spec](https://promisesaplus.com/), but are usually richer than that.
in general, you invoke an async function, it returns a promise object which "promises" that something will eventually happen:
1. the operation will fail
2. the operation will succeed
it also supports updates by the async operation.
in general, there's some method of controlling the behavior of the promise, internal to the async function, which helps you create promises, but is private to you the library writer, and not the consumer.

in this example (and henceforth) we'll be using the Q library, which supports deferred objects as a method of controling and creating promises.

the deferred/promise mechansim works like so:
in your async function...
1. create a deferred object.
2. in case of success, invoke deferred.resolve(returnValue)
3. in case of error, invoke deferred.reject(err)
4. in [optional] case of progress/notification/update, invoke deferred.notify(update object)
5. return the promise associated with the deferred (and not the deferred itself)

your consume calls your function, and gets back the promise object.
on the promise object the user can invoke, the then function, with 3 handlers: success, failure and progress.
promise.then(function(returnValue) {
	//handle return value
},
function (err) {
	//handle exception
},
function (obj) {
	//handle progress notification
})

only you, the library writer have access to the deferred and only you can resolve/reject/notify it. it's internal to your code. your consumer has a promise that something will eventually happen, and registers events on that.

different libraries offer additional syntactic sugar functions, such as:
fail/catch - register only a failure handler
finally - invoked whether or not success or failure occurred
progress - register only a notification handler
done - registers a final set of handlers, with a default error handler (in case no other is registered) to throw exceptions

and many more...

back to your examples, now with promises:

[the original sum function, now using promises in example 6](examples/example6.js)
[promisedSum usage can be found in example 7](examples/example7.js)

#4. promise chaining

in some libraries, invoking the then function of a promise (let's call it original promise) returns another promise! (let's call it chained promise)
this new promise is resolved/rejected according to the logic inside the success/failure handler.
this allows us to chain promises. 
this has several advantages:
1. decreases nesting.
2. register a failure handler for all previous invoked promises.
we can still register several failure handlers, and as errors propagate the first error handler reached will be invoked.
if it returns a reject promise, or throws an exception, a new error will propagate to the next error handler, otherwise we will continue on with the success handlers.

[promise chaining example 8](examples/example8.js)

#5. Q library 

in reality, we use deferrals and promises directly - rarely. this is because converting a standard node asynchronous function to a promise returning function is pretty standard.
that's why the Q library provides some helper functions to do exactly that.

we can: 
* take a standard node async function with callback, and create a promise returning function by using Q.nbind.
* invoke a standard node async function without the callback and get back a promise by using Q.nfcall.
* we can do the same for methods with n.invoke
* if we want something like function.apply() because we have an array of arguments we can use Q.npost and Q.napply
* if we want a promise that's pre-resolved, to be consistent with promise API though we're not really async we can just return Q(returnValue)
* for a rejected promise we can use Q.reject(new Error('some exception'));
* for a promise that will be resolvd in a while we can use Q.delay(milliseconds);
* aggregate promises with Q.all and Q.allSettled. 

[using Q helper functions in example 9](examples/example9.js)

it's also worthwhile to mention tha Q can (in develpment) enhance stacktraces:
Q.longStackSupport = true
THIS COMES WITH A PERFORMANCE PENALTY and is not for production use!

#6. then vs done

Q promises come with a done method, that should be used as the last handler instead of then. 
use it.

what is the importance of using done and not then?

the trivial:
* done defines a default error handler that throws an exception in case you haven't overridden it.
* then returns a promise for you to chain on, done doesn't because it expects to be the last of its chain.

the technical:
assume you have a promise. you attach a failure handler to it, using catch. you expect it to be called if the async operation fails.
will this work?
trivially this will work for the following flow:
* run async process
* return promise
* attach error handler on promise
* async process fails
* deferred is rejected
* promise error callback is invoked

but what about the following use case?:
* run async process
* async process fails
* deferred is rejected
* promise error handlers are invoked
* promise is returned
* add error handler on promise

will this work? it had better. this is just a race condition sometimes which is bad enough, but other times...
this is a common occurance, because many times an async api doesn't really have to make an async operaiton, sometimes it can optimize, like with a cache and return a result immediatel, but must still conform to the async api.
this means that Q must remember all exceptions and return values until "you're done with them", so that if you add event handlers even after the async operation is completed - those event handlers are invoked.

this will cause a memory leak if you never reach the "you're done with them" state.

the best way to inform the infrastructure that you're done is... by using done.

but are you done?
if you return the promise to the consumer, using done is their responsibility, and they may chain other then clauses on it before doing so. not your concern.
you use done if you don't return the promise - because you're the last handler.


#7. best practices 

now that we know Q (or a similar promises library) and realize the importance of familiarity with its API, we can learn how to use it in practice.

out methodology for writing an async function is:
* define vars, functions, but don't assign valeus to them
* return a resolved promise
* on that promise, add then clauses with the different logic you need to perform
* if you don't return the promise, but just run async code - on the last then clause, don't use then, use done.

why do it like this?
this is the only way to guarntee that you correspond to promise API:
in case of error you must guarantee that you return a rejected promise, and don't throw an exception. 
you must return a promise and no other form of value.

how can you guarantee these constraints as a methodology? 
the only instruction that you can be sure of won't throw an exception is variable declaration.

so...:
declare variables - check.
return a promise - check.
any logic that you have runs inside a then clause and Q knows to watch those for exceptions, so error handling - check.
use done (we know why fom section 6) - check.

[let's see a real example using mongo in example 10](examples/example10.js)


#8. common pitfalls 

* make sure to use ninvoke when possible, and not nfcall.
ninvoke runs a method of an object, while nfcall is for stand alone functions. don't use nfcall on methods.
this is because in javascript the "this" variable loses context depending on how a function is invoked.
also, bind only works the first time to set the "this" value constantly.
the "this" variable is not in the scope of this blog post, so just trust me on this, and if you need more information, just ask.

* if you pass bound callbacks to then clauses make sure you understand when the bind operation takes place and which variables it bind, cause they're probably not initialized yet if you use our methodology

* make sure any async node function you wrap with q is a standard async callback. for example, fs.exists from node file-system is not standard: the first arg is nor err. can't wrap it with q easily.

* if the async callback returns more than one value as a result - Q will invoke the promise success handler with a single arg that is an array. be warned.

#9. tips and tricks

so now that we know how our code should look like usually (regular 3rd party applications, wrapped with Q functions, with the methodology we mentioned), there are a few additional tricks that one can use.

* deferred to promise binding: 
in some cases, we don't yet have the promise that we want to return.
we can bind a deferred to a promise.
in fact, this is probably how promise chaining works.

[example of promise chaining via binding promise to deferred](examples/example11)


* Q.all and Q.allSettled: 
when combined with map, we can generate per entry in an array a promise via an async function, return it in the map, and wrap with Q.all

application to notify on deferred with chain of promises)

#10. testing (done done done)


