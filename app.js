var composition = Object.create(Composition);

composition.setTime(120);

var jsonSounds = Object.create(Drums);
var drums = composition.createInstrument('drums', jsonSounds);

console.log(drums.play('kick'));
