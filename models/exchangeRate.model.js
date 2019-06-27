const mongoose = require('mongoose');
const validate = require('mongoose-validator');

let ExchengeRateSchema = mongoose.Schema(
  {
    rate: { type: Number }, // Tasa de Cambio
    effectiveDate: { type: Date } // Fecha de Vigencia
  },
  { timestamps: true }
);

ExchengeRateSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

ExchengeRateSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id;
  return json;
};

let ExchengeRate = (module.exports = mongoose.model(
  'ExchengeRate',
  ExchengeRateSchema
));
