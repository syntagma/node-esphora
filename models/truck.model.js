const mongoose = require('mongoose');
const validate = require('mongoose-validator');
const shortid = require('shortid');
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

let ImageSchema = mongoose.Schema({
  originalname: { type: String },
  filename: { type: String },
  mimetype: { type: String },
  destination: { type: String },
  path: { type: String },
  size: { type: Number },
  position: { type: Number }
});

let ExpenseSchema = mongoose.Schema({
  type: { type: String },
  details: { type: String },
  provider: { type: String },
  date: { type: String },
  amount: { type: Number },
  quantity: { type: Number },
  purchase_id: { type: String },
  item_id: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved']
  }
});

let AdditionalDataPurchaseSchema = mongoose.Schema({
  transfer_mba_st: { type: Date }, // Transferencia a nombre MBA / ST
  entered_accounting_stock: { type: Date }, //Ingreso a stock contable
  entered_physical_stock: { type: Date }, // Ingreso a stock físico
  entered_kms: { type: Number }, // Km ingreso
  entered_kms_date: { type: Date } // Fecha Km ingreso
});

let AdditionalDataSaleSchema = mongoose.Schema({
  vim_0_km_mba: { type: String }, // VIN 0 Km MBA
  domain_used_taken: { type: String }, // Dominio del usado tomado
  km_exit: { type: Number }, // Km egreso
  transferred_date: { type: Date } // Transferido a 3ro
});

let TopDownItemData = mongoose.Schema({
  estimated_budget: { type: Number },
  estimated_budget_usd: { type: Number },
  real_budget: { type: Number },
  real_budget_usd: { type: Number },
  difference_usd: { type: Number },
  difference_percentage: { type: Number }
});

let TopDown = mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected']
  },
  authorized_date_up: { type: String },
  exchange_rate: { type: Number }, // Tipo de cambio
  version: { type: Number, default: 0 }, // Version
  web_price: TopDownItemData, // Precio Web
  financial_cost: TopDownItemData, // Costo financiero
  financed_price: TopDownItemData, // Precio Financiado
  gain_margin: TopDownItemData, // Margen de ganancia
  sale_price: TopDownItemData, // Precio de venta
  total_repairs: TopDownItemData, // Total reparaciones
  damages: TopDownItemData, // Daños
  maintenance_reviews: TopDownItemData, // Revisión/cambio de aceite
  luna: TopDownItemData, // Luna ??
  painting: TopDownItemData, // Pintura
  battery: TopDownItemData, // Bateria
  total_transport_handling: TopDownItemData, // Total transporte handling
  administrative_expenses: TopDownItemData, // Gastos de gestoria
  itv: TopDownItemData, // ITV
  transport: TopDownItemData, // Transporte
  homologation_costs: TopDownItemData, // Gastos de homologación
  wash: TopDownItemData, // Lavado
  total_additional_costs: TopDownItemData, // Costes unitarios adicionales
  tires: TopDownItemData, // Neumáticos
  spoilers: TopDownItemData, // Alerones
  others: TopDownItemData, // Otros
  total_technical_expenses: TopDownItemData, // total gastos técnicos
  warranties: TopDownItemData, // Garantías
  interest: TopDownItemData, // Intereses
  result_holding: TopDownItemData, // Resultado por tenencia
  seller_commission: TopDownItemData, // Provisión comisión vendedor
  concessionaire_fee: TopDownItemData, // Fee de concesionario
  iibb: TopDownItemData, // iibb
  total_other_expenses: TopDownItemData, // Total otros Gastos
  fixed_costs: TopDownItemData, // Costos fijos
  purchase_price: TopDownItemData, // Precio de compra
  overvaluation: TopDownItemData, // Sobrevaloración
  entry_price: TopDownItemData // Precio de ingreso
});

let TopDownChangeData = mongoose.Schema({
  date: { type: String },
  description: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected']
  },
  responsible: { type: String },
  version: { type: String },
  version_top_down_id: { type: String }
});

let HistoricalItemSchema = mongoose.Schema({
  value: { type: String },
  date_from: { type: Date },
  date_to: { type: Date },
  observations: { type: String }
});

let TruckSchema = mongoose.Schema(
  {
    name: { type: String }, // npmbre para mostrar del camión
    details: { type: String }, // descipción general del camión
    status: {
      type: String,
      enum: [
        'compra',
        'transferenciaCompra',
        'preparacion',
        'disponible',
        'reservado',
        'asignado',
        'facturado',
        'transfenciaVenta',
        'transferido',
        'entregado',
        'anulado'
      ]
    }, // estado
    highlighted: { type: Boolean, default: false }, // destacado
    status_from: { type: Date }, // estado desde
    status_to: { type: Date }, // estado hasta
    status_historical: [HistoricalItemSchema], // Historial de estados
    location: { type: String }, // Ubicacion fisica
    location_from: { type: Date }, // Ubicacion fisica desde
    location_to: { type: Date }, // Ubicacion fisica hasta
    location_observations: { type: String }, // Ubicacion fisica Observaciones
    location_historical: [HistoricalItemSchema], // Historial de ubicaciones
    category: {
      type: String,
      enum: ['ORO', 'PLATA', 'BRONCE', '']
    }, // categoria
    is_new: { type: Boolean, default: false }, // nuevo o usado
    price: { type: Number }, // precio de contado
    price_financing: { type: Number }, // precio financiado
    web_id: { type: String, default: shortid.generate }, // Web ID
    external_id: { type: String }, // ID
    domain: { type: String }, // Dominio
    km: { type: Number }, // Kilómetros
    brand: { type: String }, // Marca
    brand_code: { type: String }, // Marca código
    type: { type: String }, // Tipo
    type_code: { type: String }, // Tipo código
    model: { type: String }, // Modelo DNRPA
    model_code: { type: String }, // Modelo código
    model_version: { type: String }, // Version del modelo
    year: { type: Number }, // Ano Modelo inscripto
    chassis_number: { type: String }, // Nro Chassis - VIN
    chassis: { type: String }, // Marca Chassis
    date_patenting: { type: Date }, // Fecha patentamiento
    engine: { type: String }, // Marca Motor
    engine_number: { type: String }, // Nro Motor
    traction: { type: String }, // Tracción
    power: { type: Number }, // Potencia
    displacement: { type: Number }, // Cilindrada
    torque: { type: String }, // Torque
    transmission_model: { type: String }, //modelo transmisión
    transmission: {
      type: String,
      enum: ['MANUAL', 'AUTOMATIZADO', '']
    }, // Transmisión
    pbv: { type: Number }, // PBV peso bruto Vehicular
    payload: { type: Number }, // Carga útil
    emmissions_standard: { type: String }, // Normas emisión
    color: { type: String }, // Color de la unidad
    bodywork: { type: Boolean }, // Carrozado
    body_type: { type: String }, // Carrocería tipo
    body_brand: { type: String }, // Carrocería marca
    wheelbase: { type: Number }, // distancia entre ejes
    wheelbase_third_axe: { type: Number }, // distancia entre ejes (3er eje)
    measure_length: { type: Number }, // Medidas largo
    measure_height: { type: Number }, // Medidas alto
    measure_width: { type: Number }, // Medidas ancho
    fuel_type: { type: String }, // combustible
    tank_a_capacity: { type: Number }, // tanque A
    tank_b_capacity: { type: Number }, // tanque B
    urea_tank: { type: Boolean }, // tanque urea
    lubricant: { type: String }, // lubricante
    estimated_transfer_to_stock: { type: String }, // Fecha estimada de pase a stock
    factory_warranty_start: { type: String }, // Garantía de fábrica inicio
    factory_warranty_end: { type: String }, // Garantía de fábrica fin
    warranty_extended_start: { type: String }, // Garantía adicional por venta inicio
    warranty_extended_end: { type: String }, // Garantía adicional por venta fin
    maintenance_contract: { type: Boolean }, // Contrato de Mantenimiento
    type_maintenance_contract: { type: String }, // Tipo de Contrato de Mantenimiento
    maintenance_contract_from: { type: String }, // Vigencia de Contrato de Mantenimiento desde
    maintenance_contract_to: { type: String }, // Vigencia de Contrato de Mantenimiento hasta
    rto: { type: String }, // RTO Realización
    rto_expiration: { type: String }, // RTO vencimiento
    route: { type: String }, // Ruta realización
    route_expiration: { type: String }, // Ruta vencimiento
    police_verification: { type: String }, // Verificación policial para venta realización
    police_verification_expiration: { type: String }, // Verificación policial para venta vencimiento
    fleetboard: { type: Boolean }, // Fleetboard
    fleetboard_from: { type: String }, // Fleetboard Desde
    fleetboard_to: { type: String }, // Fleetboard Hasta
    autoparts_engraving: { type: Boolean }, // Grabado de autopartes
    date_autoparts_engraving: { type: String }, // fecha Grabado de autopartes
    g1_autoparts_engraving: { type: Boolean }, // Formulario G1 grabado autopartes
    satellite_locator: { type: Boolean }, // Localizador satelital
    number_satellite_locator: { type: Number }, // Número Localizador satelital
    consigned_elsewhere: { type: Boolean }, // Consignado en otro lugar
    dealership: { type: String }, // Consecionario
    dealership_from: { type: Date }, // Consecionario desde
    dealership_to: { type: Date }, // Consecionario hasta
    reception_ce_consignment: { type: Date }, // Recepcion CE de unidad en consignacion
    top_down: TopDown,
    top_down_historical: [TopDown],
    top_down_change_control: [TopDownChangeData],
    photos: [ImageSchema],
    expenses: [ExpenseSchema],
    additional_data_purchase: AdditionalDataPurchaseSchema, // datos adicionales a la factura de compra
    additional_data_sale: AdditionalDataSaleSchema // datos adicionales a la factura de venta
  },
  { timestamps: true }
);

TruckSchema.index({
  name: 'text',
  domain: 'text',
  brand: 'text',
  web_id: 'text'
});

TruckSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

TruckSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id;

  json.photos = json.photos.sort((one, two) => {
    return one.position - two.position;
  });

  return json;
};

let Truck = (module.exports = mongoose.model('Truck', TruckSchema));
