const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            cb(null, './public/uploads/pdf'); // For PDF files
        } else if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
            cb(null, './public/uploads/images'); // For image files
        } else if (['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)) {
            cb(null, './public/uploads/documents'); // For Word documents
        } else if (file.mimetype === 'text/html') {
            cb(null, './public/uploads/html'); // For HTML files
        } else if (file.mimetype === 'text/css') {
            cb(null, './public/uploads/css'); // For CSS files
        } else if (file.mimetype === 'application/javascript' || file.mimetype === 'text/javascript') {
            cb(null, './public/uploads/js'); // For JavaScript files
        } else {
            cb(null, './public/uploads/others'); // For all other file types
        }
    },
    filename: function (req, file, cb) {
        const title = req.body.title || file.originalname; // Use title if provided, fallback to 'file'
        const fileExtension = path.extname(file.originalname);
        cb(null, `${title}${fileExtension}`);
    }
});

const upload = multer({ storage });
module.exports = upload;