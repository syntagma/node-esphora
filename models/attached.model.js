const mongoose = require('mongoose');

let AttachedSchema = mongoose.Schema(
  {
    originalname: { type: String },
    filename: { type: String },
    mimetype: { type: String },
    destination: { type: String },
    path: { type: String },
    size: { type: Number },
    entity_id: { type: String }
  },
  { timestamps: true }
);

AttachedSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id;
  return json;
};

let Attached = (module.exports = mongoose.model('Attached', AttachedSchema));
