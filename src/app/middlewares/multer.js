const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

function imgType(req) {
  if (req.route.path === "/save_image") {
    return path.resolve(__dirname, "..", "..", "..", "tmp", "images")
  } 

  if(req.route.path == '/edit_profile_pic'){
    return path.resolve(__dirname, "..", "..", "..", "tmp", "profile")
  }
  
  return path.resolve(__dirname, "..", "..", "..", "tmp", "ad")

}


const multerConfig = {

    dest: (req, file) => imgType(req),
    storage: multer.diskStorage({
  
      destination: (req, file, cb) => {
        cb(null, imgType(req));
      },
      filename: async (req, file, cb) => {
        await crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);
  
          const fileName = `${hash.toString("hex")}-${file.originalname}`;
  
          cb(null, fileName);
        });
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];
  
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('invalid file type.'));
      }
    },
  }
  
  const upload = multer(multerConfig).single('file')
  
  module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        console.log('sei la')
      if (err instanceof multer.MulterError) {
  
        console.log(err)
        return res.json({ error: 'Error on saving image, try again later' })
      } else if (err) {
  
        console.log(err)
        return res.json({ error: 'Error on saving image, try again later' })
      }
      next()
  
    })
  
  }