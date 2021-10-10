
//  clone all github user repos
//  TECNO 2020 wael.had.sy@gmail.com

//  --------------------------------

//  How its work
//  1- get user repos from github api
//  2- clone each one in loop

//  --------------------------------

const https = require('https');
const shell = require('shelljs');

module.exports.username_clone_all = function(username) {
    if(username)
        username_clone_all(username);
    else
        console.log("'username' required !!");
    
    return;
}

function username_clone_all(username) {

    console.log(`will clone all "${username}" repos ... enjoy`);

    var options = {
        hostname: "api.github.com",
        port: 443, //https
        path: `/users/${username}/repos?per_page=9999`,
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
    };
    //change to http for local testing
    var req = https.get(options, function(res) {
        res.setEncoding('utf8');

        var body = '';

        res.on('data', function(chunk) {
            body = body + chunk;
        });

        res.on('end', function() {

            repos = JSON.parse(body);
            console.log(`  (${repos.length}) repos found !!`);

            //create user folder
            shell.mkdir(username);

            for (var i = 0; i < repos.length; i++) {
                console.log((i + 1) + '- ' + repos[i].name);
                shell.exec(`git clone ${repos[i].clone_url} ./${username}/${repos[i].name}`);
                console.log(repos[i].name + ' done');
                console.log('--------------');
            }

            console.log('Done !!!!');

            if (res.statusCode != 200) {
                console.log("Api call failed with response code " + res.statusCode);
                return;
            } else {
                return;
            }
        });

    });

    req.on('error', function(e) {
        console.log("Error : " + e.message);
        callback(e);
    });

    req.end();
}