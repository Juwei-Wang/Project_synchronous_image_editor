const session = require("express-session");
const bodyParser = require('body-parser')
const path = require("path");
const service = require("./service")


exports.bindRouters = (app, express) => {
    //app_route = this.app;
    console.log("lalalalala");
    app.use(session({
        secret: "We should get at list A because we can",
        name: "session_id",
        resave: false,
        saveUninitialized: true,
        //cookie: {maxAge: 5000},
        rolling: true
    }))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.resolve(__dirname + "/../css")));
    app.use(express.static(path.resolve(__dirname + "/../js")));
    app.use(express.static(path.resolve(__dirname + "/../image")));
    app.use(express.static(path.resolve(__dirname + "/../fonts")));

    //app.use(express.static(path.resolve(__dirname + "/../html")));
    setRouterSequence(app);
}


let setRouterSequence = (app) => {
    // index: main page
    app.get("/", (req, res) => {
        if (req.session.username !== undefined) {
            res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/user_profile.html"), (err) => {
                console.error(err)
            });
        } else {
            //console.log(req.session.username);
            res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/index.html"), (err) => {
                console.error(err);
            });
        }
    });

    app.get("/index.html", (req, res) => {
        if (req.session.username !== undefined) {
            res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/user_profile.html"), (err) => {
                console.error(err)
            });
        } else {
            //console.log(req.session.username);
            res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/index.html"), (err) => {
                console.error(err);
            });
        }
    });


    // JSON requirement from clients
    // app.post('/:req_name', (req, res) => {
    //         console.log(req.params["req_name"]);
    //         let JSOName = req.params["req_name"] + "JSON";
    //         console.log(JSOName);
    //         if (service.jsons[JSOName] !== undefined) {
    //             if ("delete_sessionJSON" === JSOName) {
    //                 return service.jsons[JSOName](req, res);
    //             }
    //             let returnedJSON;
    //
    //             service.jsons[JSOName](req, res).then((r) => {
    //                 console.log("luffdsfer");
    //                 returnedJSON = r
    //                 if (returnedJSON !== undefined) {
    //                     res.json(returnedJSON);
    //                     return;
    //                 } else {
    //                     console.log("lulalalu");
    //                     res.sendStatus(404);
    //                     return;
    //                 }
    //             }).catch((e) => {
    //                 console.error(e);
    //                 res.sendStatus(500);
    //             });
    //         } else {
    //             console.log("4040404!!!");
    //             res.sendStatus(404);
    //         }
    //     }
    // )

    app.post('/:req_name', (req, res) => {
            let JSOName = req.params["req_name"]
            let ret;
            console.log(JSOName);
            switch (JSOName) {
                case "login":
                    service.loginJSON(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "create_account":
                    service.create_accountJSON(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            console.log("lalala");
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "recover":
                    //recover(req, res);
                    break;
                case "user_profile":
                    service.user_profileJSON(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "add_member":
                    service.addMember(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "add_team":
                    service.addTeam(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "group_profile":
                    service.group_profile_get_infoJSON(req, res).then((r) => {
                        ret = r
                        if (ret !== undefined) {
                            res.json(ret);
                        } else {
                            res.sendStatus(404);
                        }
                    }).catch((e) => {
                        console.error(e);
                        res.sendStatus(500);
                    });
                    break;
                case "delete_session":
                    res.json(service.delete_sessionJSON(req, res));
                    break;
                default:
                    console.log("40404");
                    res.sendStatus(404);
            }


            // if (service.jsons[JSOName] !== undefined) {
            //     if ("delete_sessionJSON" === JSOName) {
            //         return service.jsons[JSOName](req, res);
            //     }
            //     let returnedJSON;
            //
            //     service.jsons[JSOName](req, res).then((r) => {
            //         console.log("luffdsfer");
            //         returnedJSON = r
            //         if (returnedJSON !== undefined) {
            //             res.json(returnedJSON);
            //             return;
            //         } else {
            //             console.log("lulalalu");
            //             res.sendStatus(404);
            //             return;
            //         }
            //     }).catch((e) => {
            //         console.error(e);
            //         res.sendStatus(500);
            //     });
            // } else {
            //     console.log("4040404!!!");
            //     res.sendStatus(404);
            // }
        }
    )

    app.get("/:h_n.html", (req, res, next) => {
        let pageName = req.params["h_n"];
        console.log(pageName);
        console.log(req.session);
        switch (pageName) {
            // No session pages.
            case "index":
            case "register":
                console.log("index and register: ");
                res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/" + req.params["h_n"] + ".html"), (err) => {
                    console.error(err)
                });
                break;
            case "":
                next();
                break;
            case undefined:
                next();
                break;
            default:
                if (req.session.username !== undefined) {
                    console.log("html: ");
                    res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/" + pageName + ".html"), (err) => {
                        console.error(err)
                    });
                } else {
                    console.log("html2: ");
                    res.contentType("text/html").sendFile(path.resolve(__dirname + "/../html/index.html"), (err) => {
                        console.error(err)
                    });
                }
        }
    });


}






