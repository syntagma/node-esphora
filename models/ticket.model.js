const mongoose = require('mongoose');
const validate = require('mongoose-validator');

let TicketSchema = mongoose.Schema(
  {
    gentime: { type: String, required: true },
    exptime: { type: String, required: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

TicketSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

TicketSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id;
  return json;
};

let Ticket = (module.exports = mongoose.model('Ticket', TicketSchema));
