const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const validate = require('mongoose-validator');
const PasswordValidator = require('password-validator');
const config = require('config');

let UserSchema = mongoose.Schema(
  {
    name: { type: String },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      validate: [
        validate({
          validator: 'isEmail',
          message: 'Not a valid email.'
        })
      ]
    },
    password: { type: String },
    change_password: { type: Boolean, default: false },
    roles: [
      {
        type: String,
        enum: [
          'admin',
          'publisher',
          'seller',
          'controller',
          'customers_admin',
          'expenses_admin',
          'web'
        ]
      }
    ]
  },
  { timestamps: true }
);

UserSchema.pre('save', function(next) {
  if (this.isModified('password') || this.isNew) {
    if (!this.change_password) this.validatePassword(this.password);
    return bcrypt_p.genSalt(10).then(salt => {
      return bcrypt_p.hash(this.password, salt).then(hash => {
        this.password = hash;
      });
    });
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(pw) {
  if (!this.password) throw new Error('password not set');

  return bcrypt_p.compare(pw, this.password).then(pass => {
    if (!pass) throw new Error('invalid password');
    return this;
  });
};

UserSchema.methods.validatePassword = function(pw) {
  let validatorSchema = new PasswordValidator();
  validatorSchema
    .is()
    .min(config.get('password.min'))
    .is()
    .max(config.get('password.max'));
  if (config.get('password.uppercase')) {
    validatorSchema.has().uppercase();
  }
  if (config.get('password.lowercase')) {
    validatorSchema.has().lowercase();
  }
  if (config.get('password.digits')) {
    validatorSchema.has().digits();
  }
  if (!config.get('password.spaces')) {
    validatorSchema
      .has()
      .not()
      .spaces();
  }

  if (!validatorSchema.validate(pw)) {
    let validateSchemaFailure = validatorSchema.validate(pw, { list: true }),
      index = validateSchemaFailure.indexOf('min');

    if (index !== -1) {
      validateSchemaFailure[index] =
        'The length of the new password must be at least ' +
        config.get('password.min') +
        ' characters';
    }

    index = validateSchemaFailure.indexOf('uppercase');
    if (index !== -1) {
      validateSchemaFailure[index] = 'Must contain at least one uppercase';
    }

    index = validateSchemaFailure.indexOf('lowercase');
    if (index !== -1) {
      validateSchemaFailure[index] = 'Must contain at least one lowercase';
    }

    index = validateSchemaFailure.indexOf('digits');
    if (index !== -1) {
      validateSchemaFailure[index] = 'Must contain at least one numeric digit';
    }

    index = validateSchemaFailure.indexOf('spaces');
    if (index !== -1) {
      validateSchemaFailure[index] = 'It can not contain spaces';
    }

    throw new Error(
      'The entered password does not complete the security requirements. These are: ' +
        validateSchemaFailure.join(', ')
    );
  }
};

UserSchema.methods.getJWT = function() {
  let expiration_time = parseInt(config.get('jwt.expiration'));
  return (
    'Bearer ' +
    jwt.sign(
      {
        user_id: this._id,
        scope: this.roles
      },
      config.get('jwt.encryption'),
      {
        expiresIn: expiration_time
      }
    )
  );
};

UserSchema.plugin(require('mongoose-diff-history/diffHistory').plugin);

UserSchema.methods.toWeb = function() {
  let json = this.toJSON();
  json.id = this._id; //this is for the front end
  return json;
};

let User = (module.exports = mongoose.model('User', UserSchema));
