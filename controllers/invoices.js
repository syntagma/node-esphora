/**
 * Created by sebastianbromberg on 10/2/15.
 */
var logger = require('winston');

exports.findInvoice = function findInvoice(companyId, pos, type, number, callback) {
    logger.info("findInvoice ----");
    var cmsBuilder = require("../builders/cmsBuilder");
    var cms = new cmsBuilder.CmsBuilder(companyId, function (err, ticket){
        callback(err, ticket);
        logger.info("findInvoice ++++");
    });

};
