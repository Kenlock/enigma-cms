import express from 'express';
import { File } from '../../models';
import { default as verifyMiddleware } from '../middleware';
import fs from 'fs';
import { resolve } from 'path';
import { ObjectId } from 'mongodb';

var router = express.Router();

router.post('/upload_file', verifyMiddleware, ({ user, body }, res, next) => {
  let fileName = body.fileToUpload.split('\\').pop(),
    { fileType, fileContent } = body,
    newFile = new File({
      fileName, fileType,
      createdDate: new Date(),
      modifiedDate: new Date(),
      uploadedBy: user.userId
    }), filepath = resolve(__dirname,
      `./public/uploads/${fileType}`, fileName);
  fs.writeFile(
    filepath,
    Buffer.from(fileContent, 'base64'), { flag: 'a+' }, (err) => {
      if (err) next(err);
      else newFile.save(function (error) {
        if (error) return next(error);
        else res.status(200).end();
      });
    }
  );
});

router.delete('/delete_file/:fileType/:id', ({ user, params }, res, next) => {
  var { id, fileType } = params;
  if (user) return File.findOneAndRemove({
    _id: ObjectId(id), fileType
  }).then(function(file) {
    let fp = resolve(__dirname,
      `./public/uploads/${fileType}`, file.fileName);
    fs.unlinkSync(fp);
    return res.redirect('/admin/file_mgmt');
  })
    .catch(err => next(err));
  else
    return res.status(500).redirect('/login').end();
});

export default router;
