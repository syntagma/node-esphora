const mongoose = require('mongoose');
const validate = require('mongoose-validator');

let SearchData = mongoose.Schema({
  brand: { type: String },
  model: { type: String },
  year: { type: Number },
  price: { type: Number }
});

let HistoricalData = mongoose.Schema({
  date: { type: String },
  details: { type: String },
  user: { type: String }
});

let CustomerSchema = mongoose.Schema(
  {
    sap_client_code: { type: String }, // Código SAP de cliente
    sap_provider_code: { type: String }, // Código SAP de proveedor
    company: { type: String }, // Empresa
    cuit: { type: Number, index: true }, // CUIT
    address: { type: String }, // Dirección
    city_town: { type: String }, // Localidad
    postal_code: { type: Number }, // Código postal
    main_activity: { type: String }, // Actividad principal
    preferences: { type: String }, // Preferencias
    holder: { type: String }, // Titular
    email_holder: {
      // Email titular
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      validate: [
        validate({
          validator: 'isEmail',
          passIfEmpty: true,
          message: 'Not a valid email.'
        })
      ]
    },
    telephone_holder: { type: Number }, // Teléfono titular
    commercial: { type: String }, // Contacto comercial
    email_commercial: {
      // Email comercial
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      validate: [
        validate({
          validator: 'isEmail',
          passIfEmpty: true,
          message: 'Not a valid email.'
        })
      ]
    },
    telephone_commercial: { type: Number }, // Teléfono comercial
    unit_sold: { type: Number }, // Unidades vendidas
    historical: [HistoricalData], // Historial
    truck_searches: [SearchData], // Unidades buscadas
    assigned_seller: { type: String }, // Vendedor asignado
    observations: { type: String } // Observaciones generales
  },
  { timestamps: true }
);

CustomerSchema.index({
  company: 'text',
  sap_client_code: 'text',
  main_activity: 'text'
});

CustomerSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

CustomerSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

let Customer = (module.exports = mongoose.model('Customer', CustomerSchema));
