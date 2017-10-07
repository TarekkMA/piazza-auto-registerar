let piazza = require("./piazza_api/piazza")
let fs = require("fs")


piazza.getEmails((accounts)=>{
    Object.keys(accounts).every(function(key, index) {
        let account = accounts[key];
        piazza.registerStudent(key,account.name,account.code,()=>{});
        return true;
    })
})