const { v4: uuidv4 } = require('uuid');
//import { v4 as uuidv4 } from 'uuid';
let SESSION_DATA = {};

function getUUID(){
    let uuid = uuidv4();
    return uuid;
}

exports.setCookieAndSession = function (req,res,username){
    let userID = getUUID();
    res.writeHead(200,{
        'Set-Cookie': `userid = ${userID};path=/;httpOnly;expires=1800`,
        "Content-Type": "application/json"
    });
    console.log("setCookieAndSession: " + SESSION_DATA);
    SESSION_DATA[userID] = username;
    return userID;
    //delete SESSION_DATA.username;
}

exports.getUserNameFromSession = function (userID){
    console.log(JSON.stringify(SESSION_DATA));
    console.log("getUserNameFromSession: " + SESSION_DATA[userID]);
    if (SESSION_DATA && SESSION_DATA.hasOwnProperty(userID)) {
        return SESSION_DATA[userID];
    }
}

exports.deleteSession = function (userID){
    if(SESSION_DATA && SESSION_DATA.hasOwnProperty(userID)){
        delete SESSION_DATA[userID];
        return true;
    }else {
        return false;
    }
}

exports.getCookie = function(request) {
    let result = {}
    request.headers.cookie && request.headers.cookie.split(';').forEach(function(Cookie) {
        // let parts = cookie.match(/(.*?)=(.*)$/)
        // cookies[ parts[1].trim() ] = (parts[2] || '').trim();
        console.log("Cookie: " + Cookie);
        let parts = Cookie.split('=');
        console.log("cookie: " + parts[1]);
        result = parts[1];
    });
    return result;
};


