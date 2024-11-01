import multer from 'fastify-multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../uploads'))
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname) // Get the file extension
    cb(null, `${file.fieldname}-${Date.now()}${extension}`)
  }
})

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed'), false)
    }
    cb(null, true)
  }
})
