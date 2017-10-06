let request = require('request');
let crypto = require('crypto');

function getCodeFromLastEmail(email, callback) {
    let emailHash = crypto.createHash('md5').update(email).digest("hex");
    console.log(email, ":", emailHash);
    let url = "http://api.temp-mail.ru/request/mail/id/" + emailHash + "/format/json/";

    request.get(url, function (error, response, body) {
        if(error){
            console.log("Error while fetching email",error);
            return;
        }
        emails = JSON.parse(body);
        if(emails[0] === undefined){
            callback(false);
            return;
        }
        lastEmail = emails[0].mail_text;
        code = lastEmail.match(/code to continue: (.*)\n\nAnd/g) ||
            lastEmail.match(/activation code: (.*)\n\nIf/g);
        if (code==null || code === undefined) {
            callback(false);
            return;
        }
        code = code[0].replace("activation code: ", "").replace("\n\If", "").replace("code to continue: ", "").replace("\n\nAnd", "").replace("\n","");
        callback(code);
    });

}

module.exports.getCodeFromLastEmail = getCodeFromLastEmail;