process.on('uncaughtException', function (err) {
  console.error('uncaught exception occurred: ' + err);
});

try {
  setTimeout(function () {
    throw new Error('you\'ll never catch me!');
  },
  0);
}
catch (err) {
  console.log('we managed to catch the exception ' + err.stack)
}
