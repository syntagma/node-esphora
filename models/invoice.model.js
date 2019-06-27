const mongoose = require('mongoose');
const validate = require('mongoose-validator');

let ItemSchema = mongoose.Schema({
  type: { type: String }, // Tipo A MODIFICAR
  details: { type: String }, // Descripcióm
  quantity: { type: Number }, // Cantidad
  unit_amount: { type: Number }, // Precio unitario
  amount: { type: Number }, // Precio total (subtotal)
  amount_usd: { type: Number }, // Precio total (subtotal) en dólares
  usage: { type: Number } // Utilización
});

let TaxpayerSchema = mongoose.Schema({
  company: { type: String },
  cuit: { type: Number },
  address: { type: String },
  city_town: { type: String },
  main_activity: { type: String }
});

let AttachedSchema = mongoose.Schema({
  originalname: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  destination: { type: String },
  path: { type: String },
  size: { type: Number },
  position: { type: Number }
});

let OtherTaxesSchema = mongoose.Schema({
  name: { type: String },
  amount: { type: Number, required: true },
  amount_usd: { type: Number, required: true }
});

let InvoiceSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['truck', 'associated', 'fixed']
    }, // Tipo
    order_number: { type: String }, // Nro Orden de compra
    number: { type: Number, required: true, index: true }, // Número
    point_of_sale: { type: Number, required: true },
    letter: { type: String, required: true },
    formatted_number: { type: String },
    date: { type: Date }, // Fecha
    oc: { type: Boolean },
    provider: TaxpayerSchema, // Proveedor / Customer asociado
    customer: TaxpayerSchema, // Proveedor / Customer asociado
    usage: { type: Number }, // Utilización
    amount: { type: Number }, // Importe sin IVA
    amount_usd: { type: Number }, // Importe sin IVA en dolares
    iva: { type: Number }, // IVA
    iva_usd: { type: Number }, // IVA en dolares
    total_amount: { type: Number }, // Importe con IVA
    total_amount_usd: { type: Number }, // Importe en dólares
    other_taxes: [OtherTaxesSchema], // Percepciones
    exchange_rate: { type: Number }, // Tipo de cambio
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    }, // Estado de aprobación
    items: [ItemSchema],
    attachments: [AttachedSchema]
  },
  { timestamps: true }
);

InvoiceSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

InvoiceSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id;
  return json;
};

let Invoice = (module.exports = mongoose.model('Invoice', InvoiceSchema));
