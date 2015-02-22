/**
 * Created by sebastianbromberg on 22/2/15.
 */

var env = {
    "development": {
        "path": "certs/test/",
        "facebook_app_secret": "facebook_dummy_dev_app_secret"
    },
    "production": {
        "path": "certs/test/",
        "facebook_app_secret": "facebook_dummy_prod_app_secret"
    }
};

exports.config = function () {
    var node_env = process.env.NODE_ENV || 'development';
    return env[node_env];
};