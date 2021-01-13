const mysql = require('mysql2');

const DATABASE_LOGIN_INFO = {
    host: '35.230.37.124',
    user: 'newuser',
    password: 'piALj0WZBoB+p7vuRfHh96aEjrVdBscDW8CuEgrQ',
    database: 'seng_513_project',
    port: 3306
};

// Return -1 if such username does not exist
// Return 0 if such password does not match the username
// Return 1 if the username exists and matches the password
// Return 2 if other errors happen
exports.userLoginCheck = async function(username, password) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    let returnValue = 2;
    try {
        const [rows, field] = await connection.execute('select * from seng_513_project.user where `username` = ?', [username]);
        if (rows.length === 0) {
            returnValue = -1;
        }
        if (returnValue === -1) {
            return returnValue;
        }
    } catch (e) {
        console.error(e);
        return 2;
    }

    try {
        const [rows2, fields2] = await connection.execute('select * from seng_513_project.user where `username` = ? and `password` = ?', [username, password]);
        if (rows2.length === 0) {
            returnValue = 0;
        } else {
            returnValue = 1;
        }
        return returnValue;
    } catch (e) {
        console.error(e);
        return 2;
    }

}

// Return 1 if the username exists and the email should be returned
// Return -1 means it has some problem during this query or in the server.
exports.getUserProfile = async function(username) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    try {
        const [rows, field] = await connection.execute('select username,email from seng_513_project.user where `username` = ?', [username]);
        if (rows.length === 0) {
            return {
                "returnCode":-1
            }
        }

        return {
            "returnCode":1,
            "userInfo":{
                "username" : username,
                "user_email" : rows[0]["email"]
            }
        }
    } catch (e) {
        console.error(e);
        return -1;
    }

}

// Return -1 if the username is duplicated
// Return 0 if the account is created
exports.createAccount = async function(username, password, email, question, answer) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database to check if the username is duplicated
    let returnValue = 0;
    try {
        const [rows, field] = await connection.execute('select * from seng_513_project.user where `username` = ?', [username]);
        if (rows.length === 1) {
            returnValue = -1;
        }
        if (returnValue === -1) {
            return returnValue;
        }
    } catch (e) {
        console.error(e);
        return 2;
    }

    // create the account
    try {
        const [rows2, field2] = await connection.execute('insert into seng_513_project.user values (UUID(), ?, ?, ?, ?, ?)', [username, email, password, question, answer]);
    } catch (e) {
        console.error(e);
        return 2;
    }
    return returnValue;
}

// Return -1 if the username does not exist
// Return 0 if the answer is incorrect
// Return 1 if the answer is correct and the new password is set
exports.answerMatch = async function (username, answer, newPassword) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    const [rows, field] = await connection.execute('select * from seng_513_project.user where `username` = ?', [username]);
    if (rows.length === 0) {
        return -1;
    }
    try {
        const [rows1, field1] = await connection.execute('select * from seng_513_project.user where `username` = ? and `answer_of_password_question` = ?', [username, answer]);
        if (rows1.length !== 1) {
            return 0;
        }
    } catch (e) {
        console.error(e);
        return 2;
    }

    try {
        const [rows2, field2] = await connection.execute('update seng_513_project.user set `password` = ? where `username` = ?', [newPassword, username]);
    } catch (e) {
        console.error(e);
        return 2;
    }
    return 1;
}
