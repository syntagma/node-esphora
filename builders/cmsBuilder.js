/**
 * Created by sebastianbromberg on 11/2/15.
 */
var ticketFactory = require("../factories/ticketFactory");
var logger = require("winston");
var jsrsasign = require('jsrsasign');
var path = require('path');
var fs = require('fs');

exports.CmsBuilder = function (companyId, callback) {
    var self = this;
    var ticket;
    var cmsMessage;

    mainStream();

    function checkExistingTicket() {
        return false;
    }

    function createTicket(callback) {
        ticket = ticketFactory.createTicket("30700627825", "30700627825", "wsfe", 3600);
        fs.writeFile(path.join(__dirname,  "TRA.xml"), ticket,function(err){
            callback(err);
        });
    }

    function signTicket(callback) {

        //var keyPath = path.join(__dirname, '../certs/test/' + "30700627825" + ".privada");
        //var certPath = path.join(__dirname, '../certs/test/' + "30700627825" + ".crt");
        //var pem = fs.readFileSync(keyPath, 'binary') +  String.fromCharCode( 13 ) + String.fromCharCode( 10 );
        //var crt = fs.readFileSync(certPath, 'binary') +  String.fromCharCode( 13 ) + String.fromCharCode( 10 );


        /*
         var prvKey = jsrsasign.KEYUTIL.getKey(pem, '30700627825');
         var sig = new jsrsasign.Signature({alg: 'SHA1withRSA'});
         sig.init(prvKey);
         sig.updateString(ticket);
         cmsMessage = sig.sign();
         */
        /*
         var crypto = require("crypto");
         //var encryptedTicked = crypto.createHash('sha1').update(ticket);//.digest('base64');
         var sign = crypto.createSign('RSA-SHA1');
         sign.update(ticket);
         cmsMessage = sign.sign(pem,'base64');
         */
        //logger.info("crt: " + crt);
        //logger.info("pem: " + pem);

        var smime = require('smime');

        return smime.sign({
            content: path.join(__dirname, "TRA.xml"),
            key: path.join(__dirname, '../certs/test/' + "30700627825" + ".privada"),
            cert: path.join(__dirname, '../certs/test/' + "30700627825" + ".crt"),
            password: '30700627825'
        }).catch(function (err) {
            logger.error("Error signing: " + err.stack);
        }).then(function (res) {
            logger.info(res); // {der, child}
            //cmsMessage = result.der;
            //logger.info("CMS Obtenido: " + res.der);
            callback(null, res);
        });

        //cmsMessage = "-----BEGIN CMS-----        MIIGsgYJKoZIhvcNAQcCoIIGozCCBp8CAQExCzAJBgUrDgMCGgUAMIIBeQYJKoZI        hvcNAQcBoIIBagSCAWY8P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJVVEYt        OCIgc3RhbmRhbG9uZT0ieWVzIj8+PGxvZ2luVGlja2V0UmVxdWVzdCB2ZXJzaW9u        PSIxLjAiPjxoZWFkZXI+PHNvdXJjZT51bmRlZmluZWQ8L3NvdXJjZT48ZGVzdGlu        YXRpb24+bmkgaWRlYTwvZGVzdGluYXRpb24+PHVuaXF1ZUlkPjE0MjM2ODkxNDEy        MTE8L3VuaXF1ZUlkPjxnZW5lcmF0aW9uVGltZT4yMDE1LTAyLTExVDIxOjEyOjIx        LjIxMVo8L2dlbmVyYXRpb25UaW1lPjxleHBpcmF0aW9uVGltZT4yMDE1LTAyLTEx        VDIxOjEyOjIxLjIxMVo8L2V4cGlyYXRpb25UaW1lPjwvaGVhZGVyPjxzZXJ2aWNl        PndzZmU8L3NlcnZpY2U+PC9sb2dpblRpY2tldFJlcXVlc3Q+oIIDtjCCA7IwggKa        oAMCAQICCAvBvKCQBKw9MA0GCSqGSIb3DQEBBQUAMEMxJTAjBgNVBAMMHEFGSVAg        VGVzdGluZyBDb21wdXRhZG9yZXMgQ0ExDTALBgNVBAoMBEFGSVAxCzAJBgNVBAYT        AkFSMB4XDTE0MTEwNTEzNDIxM1oXDTE3MDgwMTEzNDIxM1owUDEQMA4GA1UEAwwH        ZmludGVzdDEZMBcGA1UEBRMQQ1VJVCAzMDcwMDYyNzgyNTEUMBIGA1UECgwLUml0        ZW5lcmUgU0ExCzAJBgNVBAYTAkFSMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB        gQCnRguhpnplyDk+r+VnZk0ND+oBMHp3x5z+Ut9TlEq9uWb7fekNAX/Gt2xW3E0h        yqFhyP7LQs473dqgExmliMTncxWH/b7jehYr1hZQlYe65/QqmbnziuARf7x6vTfn        63qii6/OtxDXjpFKKYWBwxhavKeF3BizydihvfbZuhS8wwIDAQABo4IBHzCCARsw        DAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBeAwHQYDVR0OBBYEFMcyDkOWSPuF        nApWXrumtTwRTN3uMB8GA1UdIwQYMBaAFER07rScJt9W4cEN61cLkBk2PZYBMIG6        BgNVHSAEgbIwga8wgawGDisGAQQBgbtjAQIBAgEBMIGZMIGWBggrBgEFBQcCAjCB        iR6BhgBDAGUAcgB0AGkAZgBpAGMAYQBkAG8AIABwAGEAcgBhACAAYwBvAG0AcAB1        AHQAYQBkAG8AcgBlAHMAIABzAG8AbABvACAAdgBhAGwAaQBkAG8AIABlAG4AIABl        AG4AdABvAHIAbgBvAHMAIABkAGUAIABkAGUAcwBhAHIAcgBvAGwAbABvMA0GCSqG        SIb3DQEBBQUAA4IBAQB3L/krNCTDOOMCYR1STCd578RasGgtTJEs7qZBC+C4PNC0        ivjBxZQuye6gXc+g32FdyAppbXoSzldfk8/NKP2qrl5eMSJbOvU2/xmjyMkpm87A        sjQl88jsu+NNegDEh2tGZFguU8ZL/tl4MLw4VEJOqE7l6Vap348cz0zwYMoUaBsh       taltGIiwcqD5qJ4FU5Dc6S+j+gb7gw0j6rLII51w9lfYV0AiBAGTF0v5FAujmkEv        uMZgO1JBrANjgNFStpxgm+RpoGk9lV7671GqKgIVMWT16UlwCOzny24bKcOGJ37i        EXewoCfdLzD3PywVoH0OzgK/V/+n7rgKlzwKqSsGMYIBVDCCAVACAQEwTzBDMSUw        IwYDVQQDDBxBRklQIFRlc3RpbmcgQ29tcHV0YWRvcmVzIENBMQ0wCwYDVQQKDARB        RklQMQswCQYDVQQGEwJBUgIIC8G8oJAErD0wCQYFKw4DAhoFAKBdMBgGCSqGSIb3        DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE1MDIxMTIzMTc0Mlow        IwYJKoZIhvcNAQkEMRYEFF/04Wfh/0sVd/aDAQLADvuPLL9EMA0GCSqGSIb3DQEB        BQUABIGAAi1D4PhKInqTpGQi2hai6eju5Db5S+pRVLX5N4coDY1s6+tHyun7tm87        iajydn7t3hfPrV7eAhnZxuYY9BmjQ4EYLzxijFdKaZzcIbdq/90erUpFoA6Atb3h        mb/H0NnCM/Nio12HsH1Q/AiOW7MYQkUnvir7lFZ74WN798+k8eA=            -----END CMS-----       ";

    }

    function encodeCms() {
        //cmsMessage = new Buffer(cmsMessage).toString('base64');
        //cmsMessage = jsrsasign.KJUR.asn1.new
        //Buffer(cmsMessage).toString('base64');
        //logger.info("CMS en BASE64: " + cmsMessage);
    }

    function invokeAfipWSAA(callback) {
        var soap = require('soap');


        var url = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl';

        soap.createClient(url, function (err, client) {
            var args = [{'in0': cmsMessage}];

            client.loginCms(args, function (err, result) {
                var parseString = require('xml2js').parseString;
                logger.info("loginCms returned");

                if (err) {
                    logger.error("loginCms error returned");
                    //var cleanedErr = err.replace("\ufeff", "");
                    parseString(err.body, function (err, parsedErr) {
                        if (err) {
                            logger.error("parseString: Error parsing string. Error: " + err);
                            callback("parseString: Error parsing string. Error: " + err);
                            return;

                        }
                        logger.info("loginCms parsed");
                        if (!err) {
                            callback(err, parsedErr);
                        }
                        else {
                            logger.info(err);
                        }
                    });
                    return;
                }
                //console.log('connected....');
                parseString(result, function (err, parsed) {
                    console.dir(parsed);
                    //TODO: Una vez que funcione bien
                });
            });
        });

    }

    function mainStream() {
        logger.info("Start Building CMS ... ");
        if (checkExistingTicket()) {
            logger.info("Existing Ticket ... ");
            return ticket;
        }

        logger.info("Starting new Ticket ... ");
        createTicket(function (err){
            if (err) {
                return (err);
            }
            signTicket(function (err, result){
                cmsMessage = result.der;
                encodeCms();
                invokeAfipWSAA(function (err, ticket) {
                    callback(err, ticket);
                });

            });
        });

    }
};
