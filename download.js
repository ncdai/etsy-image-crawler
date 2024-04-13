const axios = require('axios').default
const util = require('util');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);
const fs = require('fs')
const path = require('path')

const downloadFile = async (fileUrl, outputLocationPath) => {
  console.log("downloadFile", fileUrl)

  try {
    const request = await axios.get(fileUrl, {
      responseType: 'stream',
    });

    const dirName = path.dirname(outputLocationPath);
    fs.mkdirSync(dirName, { recursive: true })

    await pipeline(request.data, fs.createWriteStream(outputLocationPath));

    return {
      fileUrl,
      outputLocationPath,
      success: true
    };
  } catch (error) {
    return {
      fileUrl,
      outputLocationPath,
      success: false,
      error
    };
  }
}

exports.downloadFile = downloadFile