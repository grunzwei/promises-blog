# promises-blog
a blog about proper promises methodology

#our real-life promises methodology

in this blog post we'll present real life best practices that we've gathered for working with promises, the libraries we use, the methodologies we've developed, the common pitfalls we're aware of and how we test such code.
we'll be starting at the level of a node newbie and progressing as things get more advanced.
we'll be using misc async modules to make our point, based on mock "setTimeout" based examples, through node fs module, mongoose with mongodb and dockerode for controlling docker via remote api.

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

[using Q helper functions in example 9](examples/example9.js)

it's also worthwhile to mention tha Q can (in develpment) enhance stacktraces:
Q.longStackSupport = true
THIS COMES WITH A PERFORMANCE PENALTY and is not for production use!

#6. then vs done



#7. best practices and common pitfalls 

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

so... declare variables - check.
return a promise - check.
any logic that you have runs inside a then clause and Q knows to watch those for exceptions, so error handling - check.

let's see an example:



(define vars, wrap everything with Q, call done, use ninvoke and not nfcall)
8. tips and tricks (promise binding, application to notify on deferred with chain of promises)
9. testing (done done done)


