const axios = require('axios').default
const HTMLParser = require('node-html-parser')
const fs = require('fs')
const path = require('path')

const stream = require('stream');
const { downloadFile } = require('./download');

var XLSX = require("xlsx");

const file = XLSX.readFile('./import.xlsx')

const firstSheetName = file.SheetNames[0]

const data = XLSX.utils.sheet_to_json(file.Sheets[firstSheetName])

const parser = async ({ src, sku }) => {
  const { data } = await axios.get(src)

  const root = HTMLParser.parse(data)
  const list = root.querySelectorAll('.image-carousel-container ul li')

  let returnData = []
  let imgIndex = 0;
  let videoIndex = 0;

  list.forEach((item, index) => {
    const img = item.querySelector('img')
    const video = item.querySelector('video source')

    let src;

    if (img) {
      src = img.getAttribute('data-src-zoom-image') || img.getAttribute('src')
      returnData.push({
        src,
        fileName: `img-${imgIndex}`
      })
      ++imgIndex;
    }

    if (video) {
      src = video.getAttribute('src')
      returnData.push({
        src,
        fileName: `vid-${videoIndex}`
      })
      ++videoIndex
    }
  })

  return returnData;
}

const handleDownload = (src, filePath, fileName) => {
  const ext = path.extname(src);
  const outputLocationPath = path.join(filePath, `./${fileName}${ext}`)
  return downloadFile(src, outputLocationPath)
}

const folder = new Date().toISOString()

Promise.all(data.map(async (item) => {
  const { SKU, URL } = item
  console.log(URL)
  const list = await parser({ src: URL, sku: SKU, })
  const res = await Promise.all(list.map((e) => handleDownload(e.src, `output/${folder}/${SKU}`, e.fileName)))
  return res;
})).then((res) => {
  console.log(res)
})
