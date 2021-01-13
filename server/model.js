const mysql = require('mysql2');

const DATABASE_LOGIN_INFO = {
    host: '35.230.37.124',
    user: 'newuser',
    password: 'piALj0WZBoB+p7vuRfHh96aEjrVdBscDW8CuEgrQ',
    database: 'seng_513_project',
    port: 3306
};

exports.getPassByUser = async function (username) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('select password from seng_513_project.user where `username` = ?', [username]);
    console.log(JSON.stringify(rows));
    await connection.end(); // 关闭通信
    return rows[0];
}

/*
    addUserInfo()
    TODO args:username,password,email,question,answer
    1:  insert return = 1 : successful
    2:  Other cases : error.
*/

exports.addUserInfo = async function (username,password,email,question,answer) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('insert into seng_513_project.user values (UUID(),?,?,?,?,?);',[username, email, password, question, answer]);
    await connection.end(); // 关闭通信
    return rows["affectedRows"];
}

/*
    getUserInfo()
    TODO args:username
    1:  select return json
    2:  Other cases : empty or other error.
*/
exports.getUserInfo = async function (username) {    // get the client
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('select * from seng_513_project.user where `username` = ?', [username]);
    await connection.end(); // 关闭通信
    return rows[0];
}

// TODO args:username
// 1. get and return data (team info : teams and its members)
// 1.5 . return {rows, fields}
// 2. Other case : empty or other error
/*
    /get_Info
    Params:
    Return: JSON
    Success:
    {returnCode:1,info:{teams:[teams],members:{team1:[members],team2:[members]}}
    Failed:
    {returnCode: -1}
*/
exports.getTeamInfo = async function () {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('select a.code, b.username from seng_513_project.team as a, seng_513_project.user as b where (a.uuid, b.uuid) in (select seng_513_project.team2members.team_uuid, seng_513_project.team2members.member_uuid from seng_513_project.team2members);');

    let info = {teams: [], members: {}};

    // obtain teams:[teams]
    let set_of_teamcode = new Set();
    for (let i of rows) {
        set_of_teamcode.add(i['code']);
    }
    info["teams"] = Array.from(set_of_teamcode);
    for (let i of info["teams"]) {
        info["members"][i] = [];
    }
    for (let i of rows) {
        info["members"][i["code"]].push(i["username"]);
    }
    await connection.end(); // 关闭通信
    return info;
    // returncode不知道 info已经处理完毕 需后端自行处理
}

// TODO args: username
// 1. add a team. with an team ID produced by Service layer and the user's username
    // return: : affectRows
// 2. Other case : empty or other error

exports.addTeam = async function (code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('insert into seng_513_project.team values (UUID(), ?)', [code]);
    await connection.end(); // 关闭通信
    return rows["affectedRows"];
}

exports.addTeamMember = async function (username, code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('insert into seng_513_project.team2members values ((select seng_513_project.team.uuid from seng_513_project.team where team.code = ? limit 1), (select seng_513_project.user.uuid from seng_513_project.user where user.username = ? limit 1));', [code, username]);
    await connection.end(); // 关闭通信
    return rows["affectedRows"];
}

exports.deleteMemberFromTeam = async function (username, code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('delete from seng_513_project.team2members where seng_513_project.team2members.team_uuid in (select seng_513_project.team.uuid from seng_513_project.team where seng_513_project.team.code = ?) and seng_513_project.team2members.member_uuid in (select seng_513_project.user.uuid from seng_513_project.user where seng_513_project.user.username = ?);', [code, username]);
    await connection.end(); // 关闭通信
    return rows[0]; //不确定这里的返回值
}

exports.deleteTeamPic = async function (team_code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('delete from seng_513_project.team_pic where seng_513_project.team_pic.team_uuid in (select seng_513_project.team.uuid from seng_513_project.team where seng_513_project.team.code = ?);', [team_code]);
    await connection.end(); // 关闭通信
    return rows[0]; //不确定这里的返回值
}

exports.deleteTeamComments = async function (team_code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('delete from seng_513_project.comment where seng_513_project.comment.team_uuid in (select seng_513_project.team.uuid from seng_513_project.team where seng_513_project.team.code = ?);', [team_code]);
    await connection.end(); // 关闭通信
    return rows[0]; //不确定这里的返回值
}

exports.deleteTeamFromMember = async function (username) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('delete from seng_513_project.team2members where seng_513_project.team2members.member_uuid in (select seng_513_project.user.uuid from seng_513_project.user where seng_513_project.user.username = ?);',[username]);
    await connection.end(); // 关闭通信
    return rows[0]; //不确定这里的返回值
}

exports.deleteTeam = async function (team_code) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('delete from seng_513_project.team where seng_513_project.team.code = ?',[team_code]);
    await connection.end(); // 关闭通信
    return rows[0]; //不确定这里的返回值
}

exports.getTeamsByUsername = async function (username) {
    // get the client
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection(DATABASE_LOGIN_INFO);
    // query database
    const [rows, field] = await connection.execute('select team.code from seng_513_project.team where team.uuid in (select team2members.team_uuid from seng_513_project.team2members where team2members.member_uuid in (select user.uuid from seng_513_project.user where user.username = ?));',[username]);
    let teams = [];
    for (let i of rows) {
        teams.push(i["code"]);
    }
    await connection.end(); // 关闭通信
    return teams;
}
