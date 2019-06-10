const RestifyRouter = require( "restify-routing" );
let passport = require( "passport" ),
    rootRouter = new RestifyRouter( ),
    //secureRouter = new RestifyRouter( ),
    //adminRouter = new RestifyRouter( ),
    //companyRouter = new RestifyRouter( ),
    //sharedRouter = new RestifyRouter( ),
    publicRouter = new RestifyRouter( ),
    publicRoutes = require( "../routes/publicRoutes" );
    //usuarioRoutes = require( "../routes/user/usuarioRoutes" ),
    //viajeRoutes = require( "../routes/user/viajeRoutes" ),
    //companiaRoutes = require( "../routes/user/companiaRoutes" ),
    //busquedaRoutes = require( "../routes/user/busquedaRoutes" ),
    //peticionRoutes = require( "../routes/user/peticionRoutes" ),
    //mensajeRoutes = require( "../routes/user/mensajeRoutes" ),
    //adminRoutes = require( "../routes/adminRoutes" ),
    //companyRoutes = require( "../routes/companyRoutes" ),
    //sharedRoutes = require( "../routes/sharedRoutes" );

rootRouter.get( "/", ( req, res ) => {
    "use strict";
    res.send( 200, "esphora-api" );
} );

publicRouter.all( "*", ( req, res, next ) => {
    "use strict";
    next();
} );

/*
secureRouter.all( "*", passport.authenticate( "user", { "session": false } ), ( req, res, next ) => {
    "use strict";
    next();
} );

adminRouter.all( "*", passport.authenticate( "admin", { "session": false } ), ( req, res, next ) => {
    "use strict";
    next();
} );

companyRouter.all( "*", passport.authenticate( "company", { "session": false } ), ( req, res, next ) => {
    "use strict";
    next();
} );

sharedRouter.all( "*", passport.authenticate( "shared", { "session": false } ), ( req, res, next ) => {
    "use strict";
    next();
} );

secureRouter.use( "/usuario", usuarioRoutes );
secureRouter.use( "/compania", companiaRoutes );
secureRouter.use( "/viaje", viajeRoutes );
secureRouter.use( "/peticion", peticionRoutes );
secureRouter.use( "/busqueda", busquedaRoutes );
secureRouter.use( "/mensaje", mensajeRoutes );
secureRouter.use( "/shared", sharedRoutes );

adminRouter.use( "/", adminRoutes );
companyRouter.use( "/", companyRoutes );
sharedRouter.use( "/", sharedRoutes );

// Build subRouter under sub-path '/secure/usuario'
// this will add restify native route map '/user/:username'
rootRouter.use( "/secure", secureRouter );
rootRouter.use( "/admin", adminRouter );
rootRouter.use( "/company", companyRouter );
rootRouter.use( "/shared", sharedRouter );
*/

publicRouter.use( "/", publicRoutes );

rootRouter.use( "/public", publicRouter );

module.exports = rootRouter;
