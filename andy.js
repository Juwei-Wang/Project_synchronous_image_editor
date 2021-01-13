if (req.url === '/CreateAccount') {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            userCreatAccount(
                String(data.username), 
                String(data.password)).then((returnValue) => {
                res.end(JSON.stringify({ret: returnValue}));
            });
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

if (req.url === '/group_profile') {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            groupProfile(
                String(data.create_teamID)).then((returnValue) => {
                res.end(JSON.stringify({ret: returnValue}));
            });
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

if (req.url === '/group_profile') {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            groupProfile(
                String(data.leave_teamID)).then((returnValue) => {
                res.end(JSON.stringify({ret: returnValue}));
            });
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}

if (req.url === '/group_profile') {
    if (req.method === "POST") {
        res.writeHead(200, {"Content-Type": "application/json"});
        let data = [];
        req.on('data', chunk => {
            data.push(chunk);
        });
        req.on('end', function () {
            data = JSON.parse(data);
            groupProfile(
                String(data.join_teamID)).then((returnValue) => {
                res.end(JSON.stringify({ret: returnValue}));
            });
        })
    } else {
        res.writeHead(405);
        res.end();
    }
    return;
}