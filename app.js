let piazza = require("./piazza_api/piazza")
let temp_mail = require("./temp_mail_api/temp_mail")
let faker = require('faker')
let fs = require('fs')


let conter = 0;
let names;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}




fs.readFile(__dirname + '/names.json', 'utf8', function (err, data) {


    names = JSON.parse(data);

    work();
});


function work(){
    let email = faker.internet.userName().toLowerCase() + "@p33.org";
    piazza.checkIfNewEmail(email, (done) => {
        piazza.requestVerifcationCode(email, (done) => {
            var getCodeInterval = setInterval(function () {
                let count = 0;
                temp_mail.getCodeFromLastEmail(email, (code) => {
                    if (code) {
                        console.log(code);
                        clearInterval(getCodeInterval);
                        let name = names[getRandomInt(0,names.length)].name;                            
                        piazza.registerStudent(email,name, code, () => {
                            console.log(email, " is registared");
                            work();
                        });
                    } else {
                        console.log("Email was not found, trying again...");
                        count++;
                        if (count >= 10) {
                            clearInterval(getCodeInterval);
                            work();
                        }

                    }
                });
            }, 1000);
        });
    });
    console.log("\n\n\n", ++conter, " Emails", "\n\n\n")
}