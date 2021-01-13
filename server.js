'use strict'

const express = require('express');

const http = require('http');
const fs = require("fs");
const url = require('url');
const path = require('path');
const router = require('./route');
let server = http.createServer((income,res)=>{
    let basename = path.basename(income.url);
    let extname = path.extname(basename);
    if(income.url !== "/favicon.ico"){
        console.log(income.url);
        console.log(basename);
        console.log(extname);
        router.route(income,res);
    }
});
let io = require('socket.io')(server);


let usersList=[];
let userCount=1;
let msgLog=[];

io.on('connection', (socket) => {
    var color = "#000000";

    console.log('a user connected');

    socket.emit('if first time user');

    socket.on('firstTimeUser', () => {
        console.log("firstTimeUserLALALALALALA!!!!");
        var usernameTaken = false;
        var tempUsername = "User" + userCount;

        for (var i=0; i < usersList.length; i++) {
            if (tempUsername == usersList[i].name) {usernameTaken=true; userCount++; tempUsername = "User" + userCount; }
        }

        var username = tempUsername;
        socket.color = color;
        socket.name = username;
        usersList.push ({name: username, color: color});
        if(!(usernameTaken)) { userCount++; }

        socket.emit('display current username', username, color);
        socket.emit('replace message log', msgLog);
        socket.emit('cookieSaved', username, color);
        io.emit('update users list', usersList);
    });

    socket.on('returningUser', (savedCookie) => {
        var usernameTaken = false;
        var tempUsername = savedCookie.substring(0, savedCookie.length - 7);
        socket.color = savedCookie.substring(tempUsername.length);

        for (var i=0; i < usersList.length; i++) {
            if (tempUsername == usersList[i].name) {usernameTaken=true; userCount++; tempUsername = "User" + userCount; }
        }

        socket.name = tempUsername;

        usersList.push({name : socket.name, color : socket.color});
        if(!(usernameTaken)) { userCount++; }

        socket.emit('cookieSaved', socket.name, socket.color);
        io.emit('replace message log', msgLog);
        io.emit('update users list', usersList);
        socket.emit('display current username', socket.name, socket.color);
    });

    socket.on('chat message', (msg) => {
        var timestamp= " [" + (new Date()).toLocaleTimeString() + "] ";

        console.log("chating!!!");

        if (msg != "") {
            if (msg.startsWith("/name")) {
                var nameAlreadyExists = false;
                var oldName = socket.name;
                socket.name = msg.slice(6);

                for (var i=0; i < usersList.length; i++) {
                    if (socket.name === usersList[i].name) {nameAlreadyExists=true; socket.name = oldName; break; }
                }

                if (!(nameAlreadyExists)) {
                    for (var i=0; i<usersList.length; i++) {
                        if (oldName === usersList[i].name) { usersList[i].name = socket.name; }
                    }
                    for (var i=0; i<msgLog.length; i++) {
                        if (oldName === msgLog[i].name) { msgLog[i].name = socket.name; }
                    }

                    socket.emit('display current username', socket.name, socket.color);
                    io.emit('replace message log', msgLog);
                    io.emit('update users list', usersList);
                }
            } else if (msg.startsWith("/color")) {
                socket.color = msg.slice(7);

                for (var i=0; i<usersList.length; i++) {
                    if (socket.name === usersList[i].name) {usersList[i].color = socket.color; }
                }
                for (var i=0; i<msgLog.length; i++) {
                    if (socket.name === msgLog[i].name) {msgLog[i].color = socket.color; }
                }

                socket.emit('display current username', socket.name, socket.color);
                io.emit('replace message log', msgLog);
                io.emit('update users list', usersList);
            } else {
                if (msgLog.length === 200) { msgLog.shift(); }
                msgLog.push({name : socket.name, timestamp : timestamp, color : socket.color, msg: msg});
                socket.broadcast.emit('chat message', timestamp, socket.color, socket.name, msg);
                socket.emit('bold message', timestamp, socket.color, socket.name, msg);
            }

            socket.emit('cookieSaved', socket.name, socket.color);

        }
    });

    socket.on('disconnect', () => {
        console.log("disconnect function execute!!")
        for (var i=0; i<usersList.length; i++) {
            if (usersList[i].name === socket.name) { usersList.splice(i, 1); }
        }

        io.emit('update users list', usersList);
        console.log('a user disconnected');
    });
});


//http.createServer(r,a)

server.listen(8080, function (err) {
    if (!err) {
        console.log('Create server on http://localhost:8080/');
    } else {
        console.log(err);
    }
});
