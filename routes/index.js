"use strict";

var invoiceRoutes = require('./invoiceRoutes');

var routes = [
	{
		uri: '/api/test',
		verb: "GET",
		action: function (req, res) {
			res.setHeader('Content-Type', 'application/json');
			var obj = {message: "Node Esphora"};
			res.send(obj);
		}
	},
	{
		uri: '/api/user',
		verb: "GET",
		action: function (req, res) {
			res.send(req.session);
		}
	}
];

function concatRoutes(childRoutes) {
	for (var i in childRoutes) {
		routes = routes.concat(childRoutes[i]);
	}
}

exports.getRoutes = function getRoutes() {
	concatRoutes([
		invoiceRoutes.getRoutes()
    ]);
	return routes;
};
