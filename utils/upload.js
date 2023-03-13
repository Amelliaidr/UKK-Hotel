const multer = require('multer')
const path = require('path')

//ini handler untuk add file
const diskStorage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname, "../uploads"))
    },
    filename : function( req, file, cb){
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})
//ini buat handler 
const upload = multer({storage : diskStorage})

module.exports = {
    upload
}

