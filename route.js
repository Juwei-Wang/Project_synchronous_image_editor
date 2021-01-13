const fs = require("fs");
const path = require('path');
const service = require('./service');
const session = require('./cookie_session')

function route(req, res) {
    let basename = path.basename(req.url);
    let extname = path.extname(basename);

    if (basename === "" || (basename !== "" && extname !== "")) {
        statusResourceHandler(req, res);
    } else {
        urlHandler(req, res);
    }
}

function login(req, res) {
    // Process ajax /login
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', async function () {
            data = JSON.parse(data);
            try {
                let cookie = await session.getCookie(req);
                console.log("login cookie: " + cookie);
                //console.log(cookies);
                let username = await session.getUserNameFromSession(cookie);
                console.log("username: " + username);
                if (username != undefined) {
                    console.log("lalala");
                    res.end(JSON.stringify({ret: 1}));
                    return;
                }
                service.userLoginCheck(String(data.username), String(data.password)).then((returnValue) => {
                    if (returnValue === 1) {
                        session.setCookieAndSession(req, res, String(data.username));
                    }
                    res.end(JSON.stringify({ret: returnValue}));
                    return;
                });
            } catch (e) {
                console.error(e);
                res.writeHead(500);
                res.end();
            }
        })
    } else {
        res.writeHead(405);
        res.end();
    }
}

function createAcc(req, res) {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            //async function createAccount(username, password, email, question, answer)
            try {
                service.createAccount(
                    String(data.username),
                    String(data.password),
                    String(data.email),
                    String(data.question),
                    String(data.answer)).then((returnValue) => {
                    res.end(JSON.stringify({ret: returnValue}));
                });
            } catch (e) {
                console.error(e);
                res.writeHead(500);
                res.end();
            }
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

function recover(req, res) {
    // Process ajax /recover
    if (req.url === '/recover') {
        if (req.method === 'POST') {
            res.writeHead(200, {"Content-Type": "application/json"});
            let data = [];
            req.on('data', chunk => {
                data.push(chunk);
            });
            req.on('end', function () {
                data = JSON.parse(data);
                try {
                    service.answerMatch(
                        String(data.username),
                        String(data.answer),
                        String(data.newPassword)).then((returnValue) => {
                        res.end(JSON.stringify({ret: returnValue}));
                    });
                } catch (e) {
                    console.error(e);
                    res.writeHead(500);
                    res.end();
                }
            })
        } else {
            res.writeHead(405);
            res.end();
        }
        return;
    }
}

function groupPro(req, res) {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            try {
                service.groupProfile(
                    String(data.create_teamID)).then((returnValue) => {
                    res.end(JSON.stringify({ret: returnValue}));
                });
            } catch (e) {
                console.error(e);
                res.writeHead(500);
                res.end();
            }
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

function userPro(req, res) {
    if (req.method === "GET") {
        res.writeHead(200, {"Content-Type": "application/json"});
        try {
            let cookie = session.getCookie(req);
            console.log("login cookie: " + cookie);
            //console.log(cookies);
            let username = session.getUserNameFromSession(cookie);
            if (username != undefined) {
                service.getUserProfile(username).then((returnValue) => {
                    res.end(JSON.stringify({ret: returnValue}));
                });
                return;
            } else {
                res.end(JSON.stringify({ret: 0})); // with no login
                return;
            }
        } catch (e) {
            console.error(e);
            res.writeHead(500);
            res.end();
        }
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

function checkSession(req, res) {
    let cookie = session.getCookie(req);
    console.log("login cookie: " + cookie);
    //console.log(cookies);
    let username = session.getUserNameFromSession(cookie);
    console.log("username: " + username);
    if (username != undefined) {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({ret: 1}));
    } else {
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({ret: -1}));
    }
}


function delete_session(req, res) {
    let cookie = session.getCookie(req);
    console.log("login cookie: " + cookie);
    let username = session.getUserNameFromSession(cookie);
    console.log("username: " + username);
    if (username != undefined) {
        console.log("delete session complete, username: " + username)
        session.deleteSession(cookie);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({ret: 1}));
    } else {
        console.log("There is no session for this user!!!");
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({ret: -1}));
    }
}

function urlHandler(req, res) {
    let basename = path.basename(req.url);
    switch (basename) {
        case "login":
            login(req, res);
            break;
        case "CreateAccount":
            createAcc(req, res);
            break;
        case "recover":
            recover(req, res);
            break;
        case "user_profile":
            userPro(req, res);
            break;
        case "group_profile":
            groupPro(req, res);
            break;
        case "check_session":
            checkSession(req, res);
            break;
        case "delete_session":
            delete_session(req,res);
            break;
        default:
            console.log("4040404!!!");
            res.writeHead(404);
            res.end();
    }
}

function statusResourceHandler(req, res) {
    let basename = path.basename(req.url);
    let extname = path.extname(basename);

    switch (extname) {
        case ".html":
        case "":
            if (req.url === "/" || req.url === "/index.html") {
                res.writeHead(200, {'Content-Type': 'text/html'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/html/index.html");
                res.write(data);
                res.end();
            } else {
                try {
                    res.writeHead(200);
                    let data = fs.readFileSync("/home/seng513account/image-o-city/html" + req.url);
                    res.write(data);
                    res.end();
                } catch (e) {
                    res.writeHead(404);
                    console.error(e);
                    res.end();
                }
            }
            break;

        case ".css":
            try {
                res.writeHead(200, {'Content-Type': 'text/css'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/css" + req.url);
                res.write(data);
                res.end();
            } catch (e) {
                res.writeHead(404);
                console.error(e);
                res.end();
            }
            break;

        case ".js":
            try {
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/js" + req.url);
                res.write(data);
                res.end();
            } catch (e) {
                res.writeHead(404);
                console.error(e);
                res.end();
            }
            break;

        case ".gif":
            try {
                res.writeHead(200, {'Content-Type': 'image/gif'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/image" + req.url);
                res.write(data);
                res.end();
            } catch (e) {
                res.writeHead(404);
                console.error(e);
                res.end();
            }
            break;

        case ".jpg":
        case ".jpeg":
            try {
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/image" + req.url);
                res.write(data);
                res.end();
            } catch (e) {
                res.writeHead(404);
                console.error(e);
                res.end();
            }
            break;

        case ".png":
            try {
                res.writeHead(200, {'Content-Type': 'image/png'});
                let data = fs.readFileSync("/home/seng513account/image-o-city/image" + req.url);
                res.write(data);
                res.end();
            } catch (e) {
                res.writeHead(404);
                console.error(e);
                res.end();
            }
            break;
        default:
            res.writeHead(404);
            res.end();
    }
}

module.exports.route = route;

