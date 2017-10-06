let request = require('request');
let fs = require('fs');


const baseUrl = 'https://graph.facebook.com/v2.10/';

const groupId = 186350798447830;
const groupMembers = (token)=>baseUrl+groupId+'?fields=members.limit(1000)&'+'access_token='+token;
const profilePic = (userId,token)=>baseUrl+'/'+userId+'/picture?height=720&'+'access_token='+token;;

let users = {};

function readToken(callback) {
    fs.readFile(__dirname + '/facebook_token.txt', 'utf8', function (err, data) {
        if (err) throw err;
        callback(data);
    });
}


function writeFile(names){
    fs.writeFile(__dirname + "/names.json", JSON.stringify(names), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

function getNames(){
    readToken((token)=>{
        request.get(groupMembers(token),(error, response, body)=>{
            console.log(body);
            let pbody = JSON.parse(body);
            writeFile(pbody.members.data);
        });        
    });
}

getNames();