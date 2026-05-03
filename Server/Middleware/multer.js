//File is stored in RAM (buffer), not on disk

import multer from 'multer'

const storage= multer.memoryStorage()

const upload = multer({storage})

export default upload;