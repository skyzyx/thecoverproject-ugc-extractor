#! /usr/bin/env node

const fs = require('fs');
const process = require('process');
const { createCanvas, loadImage } = require('canvas')
const commander = require('commander');
const path = '/Users/rparman/Desktop/covers';

const program = new commander.Command();
program
  .version('0.0.1', '-v, --version')
  .option('-r, --rotate', 'Rotate the UGC image (e.g., SNES) or not (e.g., Genesis)')
  .option('-p, --path <path>', 'The file system path to watch');

program.parse(process.argv);

if (program.path === undefined) {
  console.log('Error: --path <path> is required.');
  process.exit(1);
}

console.log(`Watching the ${program.path} directory…`);

fs.watch(program.path, (eventType, filename) => {
  if ('rename' === eventType && filename && filename.indexOf('.out.') === -1) {
    console.log(`Reformatting ${filename}…`);

    let canvas = createCanvas(1534, 2100);

    if (program.rotate) {
      let canvas = createCanvas(2100, 1534);
    }

    let ctx      = canvas.getContext('2d')
    let filePath = path + '/' + filename;

    loadImage(filePath).then(image => {
      if (program.rotate) {
        ctx.save();
        ctx.rotate(-90 * Math.PI / 180);
        ctx.drawImage(image, -3366, 0, 3366, 2100);
        ctx.restore();
      } else {
        ctx.drawImage(image, -1832, 0, 3366, 2100);
      }

      let outFile = filePath + '.out.jpg';
      let out    = fs.createWriteStream(outFile);
      let stream = canvas.createJPEGStream({
        quality: 0.95,
        chromaSubsampling: false,
      });

      stream.pipe(out);
    }).catch((error) => {
      // Nothing. Probably removed from the dir.
    });
  }
});
