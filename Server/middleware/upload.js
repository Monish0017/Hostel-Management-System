const multer = require('multer');

// Set up multer to store files in memory, no local storage
const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });

module.exports = upload;
