'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
    "app_name": [ "teneslugar-api" ],
  /**
   * Your New Relic license key.
   */
    "license_key": "63163634aa10e1449107e9913f3ddb20f3494fd3",
    "logging": {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
        "level": "info"
    }
};
