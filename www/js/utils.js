/***
 * Utils methods
 * Gives some tools
 */
function log() {
  console.log.apply(console, arguments);
}

function getRandomArbitrary(min, max) {
  var random = Math.random() * (max - min) + min;
  return Math.round(random);
}

