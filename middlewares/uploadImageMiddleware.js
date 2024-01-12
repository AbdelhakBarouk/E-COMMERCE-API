const multer = require("multer");
const CustomError = require("../errors");
const path = require("path");

const uploadMixOfImages = (destination) => {
  // Define storage settings
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../uploads/${destination}`));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });

  // Create multer middleware
  const upload = multer({ storage: storage });

  // Return the middleware
  return upload;
};
/*
const uploadMixOfImages = (destination) => {
  // Define storage settings
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../uploads/${destination}`));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });

  // Create multer middleware
  const upload = multer({ storage: storage });

  // Return the middleware
  return upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]);
};*/
const uploadSingleImage = (fieldName, destination) => {
  // Define storage settings
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../uploads/${destination}`));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });

  // Create multer middleware
  const upload = multer({ storage: storage });

  // Return the middleware
  return upload.single(fieldName);
};

module.exports = { uploadSingleImage, uploadMixOfImages };
