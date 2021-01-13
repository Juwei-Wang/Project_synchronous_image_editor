const model = require("./model");

// Return -2 if the username or the password from request is empty!!
// Return -1 if such username does not exist
// Return 0 if such password does not match the username
// Return 1 if the username exists and matches the password
// Return 2 if other errors happen

exports.loginJSON = async (req, res) => {
    if (req.session.username) {
        return {"ret": "1"};
    } else {
        if (req.body) {
            console.log(req.body);
        } else {
            console.log("body is none")
        }
        if (!req.body.username || !req.body.password) {
            return {"ret": "-2"}
        }
        let ret;
        await model.getPassByUser(req.body.username).then((r) => {
            console.log(JSON.stringify(r));
            if (r !== undefined) {
                console.log("password : " + r["password"]);
                if (req.body.password === r["password"]) {
                    req.session.username = req.body.username;
                    ret = "1";
                } else {
                    ret = "0";
                }
            } else {
                ret = "-1";
            }
        }).catch((e) => {
            console.error(e);
            //ret = "2";
            throw new Error("User Login checking Error in the Database!!!");
        })
        return {
            "ret": ret
        };
    }
}


exports.create_accountJSON = async (req, res) => {
    let body = req.body;
    if (body) {
        console.log(body);
    } else {
        console.log("body is none");
    }

    for (let key in req.body) {
        if (key === undefined) {
            return {"ret": "-2"}
        }
    }

    let ret;
    await model.addUserInfo(body.username, body.password, body.email, body.question, body.answer)
        .then((r) => {
            console.log("affectRows : " + r)
            if (r === 1) {
                // req.session.username = body.username;
                ret = 0;
            } else {
                ret = -1;
            }
        }).catch((e) => {
            throw new Error("CreateAccount Error in the databases!!!");
        })
    return {
        "ret": ret
    };
}

exports.user_profileJSON = async (req, res) => {
    // if (!req.session.username) {
    //     return {"ret": "1"};
    // }
    let session = req.session;
    if (session) {
        console.log(session);
    } else {
        console.log("Session is none");
    }
    // if (!req.body.username || !req.body.password) {
    //     return {"ret": "-2"}
    // }
    let ret;
    await model.getUserInfo(
        session.username
    ).then((r) => {
        if (r["username"] !== undefined && r["email"] !== undefined) {
            ret = {
                "returnCode": "1",
                "userInfo": {
                    "username": r.username,
                    "user_email": r.email
                }
            };
        } else {
            throw new Error("Data From DataBase is not correct!!!");
        }
    }).catch((e) => {
        throw e;
    })
    return {
        "ret": ret
    };
}


exports.delete_sessionJSON = (req, res) => {
    try {
        console.log(req.session["username"]);
        delete req.session["username"];
        return {"ret": "1"}
    } catch (e) {
        res.statusCode(500);
        return {"ret": "-1"}
    }
}

// -2 means the user haven't login yet
exports.group_profile_get_infoJSON = async (req, res) => {
    console.log("xixixixi : "+req.session.username);
    if (!(req.session.username)) {
        return {"ret": "-2"};
    }

    let ret;
    await model.getTeamInfo().then((r) => {
        if (!req.session.username) {
            return {"ret": "-2"};
        }
        //r is a object
        ret = {
            "returnCode": "1",
            "info": r
        };
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    })
    return {
        "ret": ret
    };
}

exports.addTeam = async (req, res) => {
    if (!req.session.username) {
        return {"ret": "-2"};
    }
    let teamID = "";
    for (let i = 0; i < 6; i++) {
        teamID += Math.floor(Math.random() * 10);
    }

    let ret;
    await model.addTeam(
        teamID
    ).then((r) => {
        //r is a affectRows
        if (r = 1) {
            ret = {
                "returnCode": "1",
                "teamID": teamID,
                "username": req.session.username
            };
            //teamID:};
        } else {
            ret = {"returnCode": "-1"}
        }
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    })
    return {
        "ret": ret
    };
}

exports.addMember = async (req, res) => {
    // no login
    if (!req.session.username) {
        return {"ret": "-2"};
    }

    console.log(req.body.username);
    console.log(req.body.teamID);

    let username = req.body.username;

    let isUserExist = false;
    let ret;
    await model.getUserInfo(username).then((r) => {
        console.log(r);
        if (r !== undefined) {
            isUserExist = true;
            return;
        } else {

            // not the user in database
            ret = {"returnCode": "0"};
        }
    });

    if (!isUserExist) {
        return ret;
    }

    let isAlreadyInThisTeams = true;
    await model.getTeamsByUsername(
        req.body.username
    ).then((r) => {
        console.log(r);
        console.log("lalala1");

        if (r.length === 0) {
            console.log("lalala2");
            isAlreadyInThisTeams = false;
            return;
        } else {
            let teamID = req.body.teamID;
            console.log("lalala3");
            if (typeof (teamID) === "number") {
                console.log("lalala4");
                teamID = String(teamID);
            }
            console.log(r);
            let tid
            for (tid of r) {
                console.log("lalalala : " + tid);
                console.log("lalalalaxi : " + r);

                if (tid === teamID) {
                    console.log("lalala5" + tid);

                    // Already in the aiming team
                    ret = {"returnCode": "-3"};
                    return;
                }
                console.log("lalala6" + tid);
            }
            isAlreadyInThisTeams = false;
        }
    });

    if (isAlreadyInThisTeams) {
        console.log("lalala6")
        return ret;
    }

    await model.addTeamMember(
        req.body.username,
        req.body.teamID
    ).then((r) => {
        //r is a affectRows
        //0 means the user is not exist

        if (r = 1) {
            // Can be add into the team
            ret = {"returnCode": "1", "username": req.body.username};
        } else {
            // Unknown error
            ret = {"returnCode": "-1"};
        }
    }).catch((e) => {
        console.error(e);
        res.sendStatus(500);
    })
    return {
        "ret": ret
    };
}

