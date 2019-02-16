import multer from 'multer';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('image');

export default multerUploads;
