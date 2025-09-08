const multer = require("multer");

const storage = multer.memoryStorage(); // file buffer me rahega
const upload = multer({ storage });

module.exports = upload;
