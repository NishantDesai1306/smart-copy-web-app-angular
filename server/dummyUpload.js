var path = require('path');
var fs = require('fs');
var Upload = require('./api/upload/upload.model');

module.exports = function() {
    var uploadFolder = process.env.UPLOAD_PATH;

    if (!fs.existsSync(uploadFolder)) {
        console.log('creating upload directory');
        fs.mkdirSync(uploadFolder);
    }

    if (!fs.readdirSync(uploadFolder).length) {
        var srcPath = './image/dummy_user.png';
        var targetPath = path.resolve(uploadFolder, 'dummy_user.png');

        fs.link(srcPath, targetPath, function(err) {
            if (err) {
                return console.error(err.toString());
            }

            targetPath = targetPath.substring(targetPath.indexOf('upload'));
            Upload.createUpload(targetPath)
                .catch(function(err) {
                    console.error(err.toString());
                });
        });
    }
};