/**
 * Created by sebastianbromberg on 10/2/15.
 */
"use strict";

var invoices = require('../controllers/invoices');
var util = require('util');
var restify = require('restify');
var logger = require('winston');


function MissingIdError() {
    restify.RestError.call(this, {
        statusCode: 409,
        restCode: 'MissingIdError',
        message: '"id" is a required parameter',
        constructorOpt: MissingIdError
    });

    this.name = 'MissingIdError';
}
util.inherits(MissingIdError, restify.RestError);

function findInvoice(req, res, next) {
    logger.info("finding Invoices... ");
    invoices.findInvoice(req.params.companyId, req.params.pos, req.params.type, req.params.number, function (err, response) {
        if (!err) {
            res.send(200, response);
            next();
        }
        else {
            logger.error(new Error(err));
            res.send(new Error(err));
        }
    })
}

var routes = [
    {
        uri: '/api/invoices/:companyId/find/:pos/:type/:number',
        verb: "GET",
        action: findInvoice
    }
];

exports.getRoutes = function () {
    return routes;
};