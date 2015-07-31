# promises-blog
a blog about proper promises methodology

#our real-life promises methodology

in this blog post we'll present real life best practices that we've gathered for working with promises, the libraries we use, the methodologies we've developed, the common pitfalls we're aware of and how we test such code.
we'll be starting at the level of a node newbie and progressing as things get more advanced.
we'll be using misc async modules to make our point, based on mock "setTimeout" based examples, through node fs module, mongoose with mongodb and dockerode for controlling docker via remote api.

#1. async programming in nodejs - standard node callbacks

the most basic way of handling async operations in node is by using callbacks, and that's what most libraries offer.

they will give an api like the one below (usage example included):

example 1: <expand ./examples/example1.js>

example 2: <expand ./examples/example2.js>

note that in the asynchronous callback function, the first parameter is almost always an error.
if the function ran successfully, the error object is usually null or undefined.
any remaining arguments are in case of success and should only be regarded if the error object is falsy.

#2. pain (verbosity, boilerplate, multiple async operations, error handling, nesting level)

there are several problems with working in this fashion.
the most obvious are nesting levels, boilerplate and readability.

consider the following sum: 1+2+3+4+5. let's have a go:

example 3: <expand ./examples/example3.js>

this is a trivial case, and OMG, the horror.
but now consider another issue. what if sum doesn't strictly agree with its supposed api?
what if the implementation of sum is buggy?
what if it sometimes throws an exception, even though it's not supposd to do that and should return an err parameter in the callback?

take the above example and wrap every sum invocation with try catch.

example 4: <expand ./examples/example4.js>

ok, so it's bad, but at least it's over with!

but... it gets worse!

couldn't we have just used the one try catch around the first level and not needed the internal try catch blocks?
sum is an asynchronous function, and depending on its implementation you can't always try catch things.
in our case we wrote sum and it's mocky and trivial, but in real complex async code, sum could be comprised of
many 2nd/3rd party asynchronous functions, and any of those could be suffering from the following problem:

example 5: <expand ./examples/example5.js>

output: uncaught exception occurred: you'll never catch me!

if you recall from earlier we mentioned that asynchronous functions will be processed at a later time by the nodejs eventloop. that means that those functions run pretty much without context. they're registered - and that's it. so no try catch - which is in the "now". that execution flow is done with. when the async function is invoked, it's a completely different stack trace.
and yes, due to this, if you throw an exception in the async function you won't know where it's invoked from, usually.

#3. promises

to alleviate these issues, we have promises. they won't magically solve everything -
nothing can help you if an async 3rd party you use which doesn't try catch on an async function internally correctly - there's nothing you can do.
but with the right methodology you can make sure all your 2nd/1st party code is in the clear.

in this example (and henceforth) we'll be using the Q library.

we create a deferred. 

example 6: <expand ./examples/example6.js>

now let's use the promisedSum function

example 7: <expand ./examples/example7.js>

#4.promise chaining

example 8: <expand ./examples/example8.js>

5. Q library (nfcall, ninvoke, Q(), Q.reject(), Q.all())
6. best practices and common pitfalls (define vars, wrap everything with Q, call done)
7. tips and tricks (promise binding, application to notify on deferred with chain of promises)
8. testing (done done done)


