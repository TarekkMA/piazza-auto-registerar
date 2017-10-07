
/*

"judson70@p33.org": {
        "ours": true,
        "code": "SlOR0yT9jyo",
        "name": "Eulah Bauch",
        "pass": "fPih2opF2m",
        "verifaied": true
}

*/

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let piazza = require("./piazza_api/piazza")
let fs = require("fs")
let counter = 0;

fs.readFile(__dirname + '/names.json', 'utf8', function (err, data) {
    if (err) throw err;
    let names = JSON.parse(data);
    piazza.getEmails((accounts)=>{
        Object.keys(accounts).every(function(key, index) {
            counter++;
            let account = accounts[key];
            if(account.ours && account.verifaied){
                let email = key;
                let password = account.pass;
                console.log("Auth:",email,password);
                piazza.authAccount(email,password,(token)=>{
                    if(!token)return;
                    console.log("token",token);
                    let name = names[getRandomInt(0,names.length)].name;
                    piazza.renameAccount(name,email,token,(done)=>{
                        if(done){
                            console.log("Renamed",accounts[key].name,"to",name);    
                            console.log("Email Num "+counter);                        
                            accounts[key].name = name;
                            piazza.writeFile(accounts);
                        }
                    });
                });
            }
            //if(index>10)return false;
            return true;
        });
    });
});


