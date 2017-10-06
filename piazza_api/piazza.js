let request = require('request');
let faker = require('faker');
let fs = require('fs');
let accounts;

function readFile(callback) {
    fs.readFile(__dirname + '/accounts.json', 'utf8', function (err, data) {
        if (err) throw err;
        accounts = JSON.parse(data);
        callback();
    });
}

function writeFile(){
    fs.writeFile(__dirname + "/accounts.json", JSON.stringify(accounts), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

function addBadAccountToFile(mail) {
    accounts[mail] = {
        ours: false
    };
    writeFile();
}

function addVerifaiedEmail(email,password,name,code){
    accounts[email] = {
        ours: true,
        code: code,
        name: name,
        pass: password,
        verifaied: true      
    }
    writeFile();
}

function addUnverifaiedEmail(email,code){
    accounts[email] = {
        ours: true,
        code: code,
        verifaied: false      
    }
    writeFile();
}

function getForgetPasswordPayload(email) {
    return {
        method: "user.new_password",
        params: {
            email: email
        }
    }
}

function checkIfNewEmail(email, callback) {
    readFile(function () {
        if (accounts.hasOwnProperty(email)) {
            console.log("Email is found insde the file");
            callback(false);
            return;
        }
        console.log("Email was not found inside the file");
        console.log("Checking api");
        request.post({
            url: 'https://piazza.com/logic/api?method=company.forgot_password',
            body: JSON.stringify(getForgetPasswordPayload(email))
        }, function (error, response, body) {
            let parsedBody = JSON.parse(body);
            if (parsedBody.result === "OK") {
                callback(false);
                console.log("Email is not ouers");
                addBadAccountToFile(email);
            } else {
                callback(true);
                console.log("Email is new we can have it");
            }
        });
    });

}

function requestVerifcationCode(email, callback) {
    readFile(function () {
        if (accounts.hasOwnProperty(email) && accounts[email].verifaied) {
            console.log("Email is verifaied");
            return;
        }

        request.post({
            url: 'https://piazza.com/logic/api?method=network.join',
            body: JSON.stringify({
                method: "network.join",
                params: {
                    email: email,
                    nids: ["j640gw1jigu160"],
                    nids_ta: [],
                    nids_prof: [],
                    codes: {
                        j640gw1jigu160: "cse116-1st"
                    }
                }
            })
        }, function (error, response, body) {
            let parsedBody = JSON.parse(body);
            if (!parsedBody.error) {
                callback(true);
                console.log("Verfcation code sent to email");
            } else {
                console.log("There is an error ", body);
                callback(false);
            }
        });
    });
}

function registerStudent(email, code, callback) {
    readFile(()=>{
        const password = faker.internet.password(10);
        const name = faker.name.findName();
        const body = {
            method: "user.first_update",
            params: {
                token: code,
                name: name,
                email: email,
                pass: password,
                opt_in: true,
                opt_in_type: "2",
                page_version: "L_tail",
                careers_toggles: {
                    careers_insights: true,
                    companies_campus: true,
                    companies_message: true
                }
            }
        };
        request.post({
            url: "https://piazza.com/logic/api?method=user.first_update",
            body: JSON.stringify(body)
        }, function (error, response, body) {
            if (!error) {
                let parsedBody = JSON.parse(body);
                if (!parsedBody.result == "OK,OK" || !parsedBody.error) {
                    console.log("Email registared");
                    addVerifaiedEmail(email,password,name,code);
                    callback(true);
                }else{
                    console.log("Error ",body);
                    callback(false);                
                }
            } else {
                console.log("Error ",error);
                callback(false);            
            }
        });
    })
}

module.exports.checkIfNewEmail = checkIfNewEmail;
module.exports.registerStudent = registerStudent;
module.exports.requestVerifcationCode = requestVerifcationCode;