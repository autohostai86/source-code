/** @format */
import fs from 'fs';
import multer from 'multer';
import path from 'path';

const maxSize = 20971520; // 20 mb limit

function saveImgToDirectory(cb, processType) {
    const dir = `./uploads/${processType}`;

    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            return '';
        }
        return cb(null, dir);
    });
    return '';
}

function saveBatchImgToDirectory(cb, templateId) {
    const dir = `./uploads/batch/batch_input_files/${templateId}`;

    fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            return '';
        }
        return cb(null, dir);
    });
    return '';
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { processType } = req.body;

        saveImgToDirectory(cb, processType);
    },

    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        //

        cb(null, `${Date.now()}${extName}`);
    },
});

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        const { templateId } = req.body;

        saveBatchImgToDirectory(cb, templateId);
    },

    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname);
        //

        cb(null, `${Date.now()}${extName}`);
    },
});

const singleUpload = multer({ storage: storage, limits: { fileSize: maxSize } });
const batchUpload = multer({ storage: storage1, limits: { fileSize: maxSize } });

export { singleUpload, batchUpload };
