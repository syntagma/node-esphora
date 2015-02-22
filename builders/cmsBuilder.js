/**
 * Created by sebastianbromberg on 11/2/15.
 */
var ticketFactory = require("../factories/ticketFactory");
var logger = require("winston");
var path = require('path');
var fs = require('fs');

exports.CmsBuilder = function (companyId, callback) {
    var self = this;
    var ticket = {};
    var cmsMessage;

    mainStream();

    function createTicket(callback) {
        ticket = ticketFactory.createTicket("30700627825", "30700627825", "wsfe", 3600);
        callback();
        //var sha1 = require('sha1');
        //fs.writeFile(path.join(__dirname, "TRA.xml"), ticket, function (err) {
        //    callback(err);
        //});
    }

    function signTicket(callback) {
        logger.info("signTicket --------------- ");

        var signHelper = require('../helpers/signHelper');
        var Readable = require('stream').Readable;

        var s = new Readable();
        s.push(ticket.xml);    // the string you want
        s.push(null);      // indicates end-of-file basically - the end of the stream

        signHelper.sign({
            content: s, //fs.createReadStream(path.join(__dirname, "TRA.xml")),
            key: path.join(__dirname, '../certs/test/' + "30700627825" + ".privada"),
            cert: path.join(__dirname, '../certs/test/' + "30700627825" + ".crt"),
            password: '30700627825'
        }).catch(function (err) {
            logger.error("Error signing: " + err.stack);
            logger.info("signTicket ++++++++++++");
            callback(err);
        }).then(function (result) {
            cmsMessage = result.der;

            logger.info("signTicket ++++++++++++");
            callback(null);
        });


        //cmsMessage = "-----BEGIN CMS-----        MIIGsgYJKoZIhvcNAQcCoIIGozCCBp8CAQExCzAJBgUrDgMCGgUAMIIBeQYJKoZI        hvcNAQcBoIIBagSCAWY8P3htbCB2ZXJzaW9uPSIxLjAiIGVuY29kaW5nPSJVVEYt        OCIgc3RhbmRhbG9uZT0ieWVzIj8+PGxvZ2luVGlja2V0UmVxdWVzdCB2ZXJzaW9u        PSIxLjAiPjxoZWFkZXI+PHNvdXJjZT51bmRlZmluZWQ8L3NvdXJjZT48ZGVzdGlu        YXRpb24+bmkgaWRlYTwvZGVzdGluYXRpb24+PHVuaXF1ZUlkPjE0MjM2ODkxNDEy        MTE8L3VuaXF1ZUlkPjxnZW5lcmF0aW9uVGltZT4yMDE1LTAyLTExVDIxOjEyOjIx        LjIxMVo8L2dlbmVyYXRpb25UaW1lPjxleHBpcmF0aW9uVGltZT4yMDE1LTAyLTEx        VDIxOjEyOjIxLjIxMVo8L2V4cGlyYXRpb25UaW1lPjwvaGVhZGVyPjxzZXJ2aWNl        PndzZmU8L3NlcnZpY2U+PC9sb2dpblRpY2tldFJlcXVlc3Q+oIIDtjCCA7IwggKa        oAMCAQICCAvBvKCQBKw9MA0GCSqGSIb3DQEBBQUAMEMxJTAjBgNVBAMMHEFGSVAg        VGVzdGluZyBDb21wdXRhZG9yZXMgQ0ExDTALBgNVBAoMBEFGSVAxCzAJBgNVBAYT        AkFSMB4XDTE0MTEwNTEzNDIxM1oXDTE3MDgwMTEzNDIxM1owUDEQMA4GA1UEAwwH        ZmludGVzdDEZMBcGA1UEBRMQQ1VJVCAzMDcwMDYyNzgyNTEUMBIGA1UECgwLUml0        ZW5lcmUgU0ExCzAJBgNVBAYTAkFSMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB        gQCnRguhpnplyDk+r+VnZk0ND+oBMHp3x5z+Ut9TlEq9uWb7fekNAX/Gt2xW3E0h        yqFhyP7LQs473dqgExmliMTncxWH/b7jehYr1hZQlYe65/QqmbnziuARf7x6vTfn        63qii6/OtxDXjpFKKYWBwxhavKeF3BizydihvfbZuhS8wwIDAQABo4IBHzCCARsw        DAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCBeAwHQYDVR0OBBYEFMcyDkOWSPuF        nApWXrumtTwRTN3uMB8GA1UdIwQYMBaAFER07rScJt9W4cEN61cLkBk2PZYBMIG6        BgNVHSAEgbIwga8wgawGDisGAQQBgbtjAQIBAgEBMIGZMIGWBggrBgEFBQcCAjCB        iR6BhgBDAGUAcgB0AGkAZgBpAGMAYQBkAG8AIABwAGEAcgBhACAAYwBvAG0AcAB1        AHQAYQBkAG8AcgBlAHMAIABzAG8AbABvACAAdgBhAGwAaQBkAG8AIABlAG4AIABl        AG4AdABvAHIAbgBvAHMAIABkAGUAIABkAGUAcwBhAHIAcgBvAGwAbABvMA0GCSqG        SIb3DQEBBQUAA4IBAQB3L/krNCTDOOMCYR1STCd578RasGgtTJEs7qZBC+C4PNC0        ivjBxZQuye6gXc+g32FdyAppbXoSzldfk8/NKP2qrl5eMSJbOvU2/xmjyMkpm87A        sjQl88jsu+NNegDEh2tGZFguU8ZL/tl4MLw4VEJOqE7l6Vap348cz0zwYMoUaBsh       taltGIiwcqD5qJ4FU5Dc6S+j+gb7gw0j6rLII51w9lfYV0AiBAGTF0v5FAujmkEv        uMZgO1JBrANjgNFStpxgm+RpoGk9lV7671GqKgIVMWT16UlwCOzny24bKcOGJ37i        EXewoCfdLzD3PywVoH0OzgK/V/+n7rgKlzwKqSsGMYIBVDCCAVACAQEwTzBDMSUw        IwYDVQQDDBxBRklQIFRlc3RpbmcgQ29tcHV0YWRvcmVzIENBMQ0wCwYDVQQKDARB        RklQMQswCQYDVQQGEwJBUgIIC8G8oJAErD0wCQYFKw4DAhoFAKBdMBgGCSqGSIb3        DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE1MDIxMTIzMTc0Mlow        IwYJKoZIhvcNAQkEMRYEFF/04Wfh/0sVd/aDAQLADvuPLL9EMA0GCSqGSIb3DQEB        BQUABIGAAi1D4PhKInqTpGQi2hai6eju5Db5S+pRVLX5N4coDY1s6+tHyun7tm87        iajydn7t3hfPrV7eAhnZxuYY9BmjQ4EYLzxijFdKaZzcIbdq/90erUpFoA6Atb3h        mb/H0NnCM/Nio12HsH1Q/AiOW7MYQkUnvir7lFZ74WN798+k8eA=            -----END CMS-----       ";

    }

    function encodeCms() {
        cmsMessage = Buffer(cmsMessage).toString('base64');
    }

    function invokeAfipWSAA(callback) {
        logger.info("invokeAfipWSAA --------------- ");
        var soap = require('soap');


        var url = 'https://wsaahomo.afip.gov.ar/ws/services/LoginCms?wsdl';

        soap.createClient(url, function (err, client) {
            var args = [{'in0': cmsMessage}];

            client.loginCms(args, function (err, result) {
                var parseString = require('xml2js').parseString;

                if (err) {
                    logger.error("loginCms error returned");
                    //var cleanedErr = err.replace("\ufeff", "");
                    parseString(err.body, function (err, parsedErr) {
                        if (err) {
                            callback("parseString: Error parsing string. Error: " + err);
                            return;

                        }

                        var afipError = {
                            "code": parsedErr['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0].faultcode[0]['_'],
                            "message": parsedErr['soapenv:Envelope']['soapenv:Body'][0]['soapenv:Fault'][0].faultstring[0]
                        };

                        callback(afipError);
                        logger.info("invokeAfipWSAA ++++++++++++++ ");
                    });
                    return;
                }

                parseString(result.loginCmsReturn, function (err, parsed) {
                    console.dir(parsed);
                    callback(err, parsed.loginTicketResponse.credentials);
                    logger.info("invokeAfipWSAA ++++++++++++++ ");
                });
            });
        });

    }

    function mainStream() {
        logger.info("Start Building CMS ... ");

        createTicket(function (err) {
            if (err) {
                callback (err);
                return;
            }
            signTicket(function (err) {
                if (err) {
                    callback (err);
                    return;
                }
                encodeCms();
                invokeAfipWSAA(function (err, credentials) {
                    if (err){
                        callback (err);
                        return;
                    }
                    console.dir(credentials);
                    ticket.company = companyId;
                    ticket.sign = credentials[0].sign;
                    ticket.token = credentials[0].token;
                    callback(err, ticket);
                });

            });
        });

    }
};
