"use strict";

exports.routesResolver = function (server) {
	var RouteSetter = function (options) {
			this.verb = options.verb;
			this.setter = options.setter;
			this.withContentType = options.withContentType;
			this.next = null;
		};

		RouteSetter.prototype = {
			setRoute: function(route) {
				if (this.verb === route.verb) {
					if ( (route.contentType && this.withContentType) || (!route.contentType && !this.withContentType)) {
						this.setter(route);
						return;
					}
				}
				this.next && this.next.setRoute(route);
			},

			setNextSetter: function(responsible) {
				this.next = responsible;
			}
		};

		var setterGET = new RouteSetter({
			verb: "GET", 
			withContentType: false,
			setter: function (route) {
				server.get(route.uri, route.action);
			}
		});

		var setterPOSTNoContentType = new RouteSetter({
			verb: "POST", 
			withContentType: false,
			setter: function (route) {
				server.post(route.uri, route.action);
			}
		});

		var setterPOST = new RouteSetter({
			verb: "POST", 
			withContentType: true,
			setter: function (route) {
				server.post({path:route.uri, contentType: route.contentType}, route.action);
			}
		});

		var setterPUTNoContentType = new RouteSetter({
			verb: "PUT", 
			withContentType: false,
			setter: function (route) {
				server.put(route.uri, route.action);
			}
		});

		var setterPUT = new RouteSetter({
			verb: "PUT", 
			withContentType: true,
			setter: function (route) {
				server.put({path:route.uri, contentType: route.contentType}, route.action);
			}
		});

		var setterDELETE = new RouteSetter({
			verb: "DELETE", 
			withContentType: true,
			setter: function (route) {
				server.delete({path:route.uri, contentType: route.contentType}, route.action);
			}
		});

		setterGET.setNextSetter(setterPOST);
		setterPOST.setNextSetter(setterPOSTNoContentType);
		setterPOSTNoContentType.setNextSetter(setterPUT);
		setterPUT.setNextSetter(setterPUTNoContentType);
		setterPUTNoContentType.setNextSetter(setterDELETE);


		return setterGET;
};