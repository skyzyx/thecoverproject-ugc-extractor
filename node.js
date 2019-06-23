#! /usr/bin/env node

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const path = '/Users/rparman/Desktop/covers';

// let dir = fs.readdirSync(path, {
//   encoding: 'utf8',
//   withFileTypes: true,
// })

// for (let file of dir) {
//   let canvas   = createCanvas(2100, 1534)
//   let ctx      = canvas.getContext('2d')
//   let filePath = path + '/' + file.name;

//   loadImage(filePath).then(image => {
//     ctx.save();
//     ctx.rotate(-90 * Math.PI / 180);
//     ctx.drawImage(image, -3366, 0, 3366, 2100);
//     ctx.restore();

//     let outFile = filePath + '.out.jpg';
//     let out    = fs.createWriteStream(outFile);
//     let stream = canvas.createJPEGStream({
//       quality: 0.95,
//       chromaSubsampling: false,
//     });

//     stream.pipe(out);
//     out.on('finish', () => console.log(`Wrote ${outFile}…`));
//   });
// }


fs.watch(path, (eventType, filename) => {
  console.log(`event type is: ${eventType}`);
  if ('rename' === eventType && filename && filename.indexOf('.out.') === -1) {
    console.log(`Reformatting ${filename}…`);

    let canvas   = createCanvas(2100, 1534)
    let ctx      = canvas.getContext('2d')
    let filePath = path + '/' + filename;

    loadImage(filePath).then(image => {
      ctx.save();
      ctx.rotate(-90 * Math.PI / 180);
      ctx.drawImage(image, -3366, 0, 3366, 2100);
      ctx.restore();

      let outFile = filePath + '.out.jpg';
      let out    = fs.createWriteStream(outFile);
      let stream = canvas.createJPEGStream({
        quality: 0.95,
        chromaSubsampling: false,
      });

      stream.pipe(out);
      out.on('finish', () => console.log(`Done.`));
    });
  } else {
    console.log('no action performed.');
  }
});
