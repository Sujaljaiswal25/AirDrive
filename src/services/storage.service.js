const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Upload file to ImageKit
 * @param {Buffer} fileBuffer - multer buffer
 * @param {string} fileName - file name
 * @returns uploaded file URL and metadata
 */
const uploadFile = async (fileBuffer, fileName) => {
  try {
    const result = await imagekit.upload({
      file: fileBuffer.toString("base64"),
      fileName: fileName,
      
    });
    return result; // contains url, fileId etc
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { uploadFile };
