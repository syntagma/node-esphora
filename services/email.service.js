const fs = require('fs'),
  _ = require('underscore'),
  config = require('config'),
  nodemailer = require('nodemailer'),
  smtpTransport = nodemailer.createTransport(config.get('nodeMailer.options')),
  SUBJECT = {
    PASSWORD: 'Nueva Contraseña de su usuario selectrucks',
    INTERESTED_CONTACT: 'Interesado en una unidad',
    FINANCE_CONTACT: 'Contacto de financiamiento'
  };

global.MESSAGE_TYPE = {
  FORGOT_PWD: 'forgotPassword',
  INTERESTED_CONTACT: 'interestedContact',
  FINANCE_CONTACT: 'financeContact'
};

const getHtml = (templateName, data) => {
  const templatePath = `services/email_templates/${templateName}.html`;

  return new Promise(function(resolve, reject) {
    fs.readFile(templatePath, 'utf8', (err, templateContent) => {
      if (err) reject(err);

      let compiled = _.template(templateContent);
      resolve(compiled(data));
    });
  });
};

const sendMailProcessSMTP = (user, template, data) => {
  return getHtml(template, data).then(html => {
    let mailData = {
      html: html,
      from: data.from,
      to: data.to,
      subject: data.subject
    };

    if (data.attachments) {
      mailData.attachments = data.attachments;
    }

    return smtpTransport.sendMail(mailData);
  });
};

exports.EmailSender = class {
  constructor() {
    this.frontendURL = config.get('app.base_url');
  }

  forgotPassword(dto) {
    const data = {
      from: config.get('mailing.sender.email'),
      to: dto.email,
      usuario: dto.email,
      contrasenia: dto.unsecuredPassword,
      subject: SUBJECT.PASSWORD,
      frontendUrl: this.frontendURL
    };
    return sendMailProcessSMTP(dto, MESSAGE_TYPE.FORGOT_PWD, data);
  }

  interestedContact(dto) {
    const data = {
      from: {
        name: config.get('mailing.sender.name'),
        address: config.get('mailing.sender.address')
      },
      to: {
        name: config.get('mailing.admin.name'),
        address: config.get('mailing.admin.address')
      },
      title: SUBJECT.INTERESTED_CONTACT,
      subtitle: 'Un usuario se ha contactado porque se interesó por una unidad',
      message:
        'A continuación se encuentran los datos que el interesado colocó en la web:',
      contact: dto,
      subject: SUBJECT.INTERESTED_CONTACT,
      frontendUrl: this.frontendURL,
      attachments: [
        {
          filename: 'logo-selectrucks.jpg',
          path: config.get('mailing.logo.image'),
          cid: 'logo@selectrucks' //same cid value as in the html img src
        }
      ]
    };
    return sendMailProcessSMTP(dto, MESSAGE_TYPE.INTERESTED_CONTACT, data);
  }

  financeContact(dto) {
    const data = {
      from: {
        name: config.get('mailing.sender.name'),
        address: config.get('mailing.sender.address')
      },
      to: {
        name: config.get('mailing.admin.name'),
        address: config.get('mailing.admin.address')
      },
      title: SUBJECT.FINANCE_CONTACT,
      subtitle: 'Un usuario se ha contactado para financiar una unidad',
      message:
        'A continuación se encuentran los datos que el interesado seleccionó para financiar:',
      contact: dto,
      subject: SUBJECT.FINANCE_CONTACT,
      frontendUrl: this.frontendURL,
      attachments: [
        {
          filename: 'logo-selectrucks.jpg',
          path: config.get('mailing.logo.image'),
          cid: 'logo@selectrucks' //same cid value as in the html img src
        }
      ]
    };
    return sendMailProcessSMTP(dto, MESSAGE_TYPE.FINANCE_CONTACT, data);
  }
};
