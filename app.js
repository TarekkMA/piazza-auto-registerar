let piazza = require("./piazza_api/piazza")
let temp_mail = require("./temp_mail_api/temp_mail")
let faker = require('faker')


let conter = 0;
setInterval(()=>{
    let email = faker.internet.userName().toLowerCase() + "@p33.org";    
    piazza.checkIfNewEmail(email, (done) => {
        piazza.requestVerifcationCode(email, (done) => {
            var getCodeInterval = setInterval(function () {
                let count = 0;
                temp_mail.getCodeFromLastEmail(email, (code) => {
                    if (code) {
                        console.log(code);
                        clearInterval(getCodeInterval);                
                        piazza.registerStudent(email, code, () => {
                            console.log(email, " is registared");
                        });
                    } else {
                        console.log("Email was not found, trying again...");
                        count++;
                        if(count >= 5)clearInterval(getCodeInterval);                
                        
                    }
                });
            }, 1000);
        });
    });
    console.log("\n\n\n",++conter," Emails","\n\n\n")
},10000);



function getCodeFromLastEmail(email, callback) {
    
}