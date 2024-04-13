const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(1000, 1000)

const ctx = canvas.getContext('2d')

const fs = require('fs')

// Draw cat with lime helmet
loadImage('sample-img.jpg').then((image) => {
  ctx.drawImage(image, 0, 0, 0, 0)

  const out = fs.createWriteStream(__dirname + '/test.jpeg')

  const stream = canvas.createJPEGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The JPEG file was created.'))

  // console.log('<img src="' + canvas.toBuffer() + '" />')
  // const buffer = canvas.createJPEGStream();

  // fs.createWriteStream("./test.jpg", buffer);
})