const config = require('config');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const uploader = (file, options) => {
  if (!file) throw new Error('no file(s)');

  return Array.isArray(file)
    ? _filesHandler(file, options)
    : _fileHandler(file, options);
};

const _filesHandler = (files, options) => {
  if (!files || !Array.isArray(files)) throw new Error('no files');

  const promises = files.map(x => _fileHandler(x, options));
  return Promise.all(promises);
};

const _fileHandler = (file, options) => {
  if (!file) throw new Error('no file');
  const orignalname = file.hapi.filename;
  const filename = uuidv4();
  const path = `${options.dest}${filename}`;
  const fileStream = fs.createWriteStream(path);

  return new Promise((resolve, reject) => {
    file.on('error', err => {
      reject(err);
    });

    file.pipe(fileStream);

    file.on('end', err => {
      const fileDetails = {
        fieldname: file.hapi.name,
        originalname: file.hapi.filename,
        filename,
        mimetype: file.hapi.headers['content-type'],
        destination: `${options.dest}`,
        path,
        size: fs.statSync(path).size
      };

      resolve(fileDetails);
    });
  });
};

const upload = async (files, upload_path) => {
  if (!files || files.length == 0) return [];

  if (!fs.existsSync(upload_path)) fs.mkdirSync(upload_path);

  const fileOptions = { dest: `${upload_path}/` };
  const filesDetails = await uploader(files, fileOptions);

  return filesDetails;
};

const uploadImages = async files => {
  const UPLOAD_PATH = config.get('files.upload_images_path');
  return upload(files, UPLOAD_PATH);
};
module.exports.uploadImages = uploadImages;

const uploadAttachments = async files => {
  const UPLOAD_PATH = config.get('files.upload_attachments_path');
  return upload(files, UPLOAD_PATH);
};
module.exports.uploadAttachments = uploadAttachments;

const remove = async file => {
  if (!file) throw new Error('no file');

  if (fs.existsSync(file.path)) {
    fs.unlink(file.path, err => {
      if (err) throw err;
      return true;
    });
  }

  return true;
};
module.exports.remove = remove;
