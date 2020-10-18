//  clone all github user repos
//  TECNO 2020 wael.had.sy@gmail.com

//  --------------------------------

//  ToDo

//  --------------------------------

//  How its work
//  1- get user repos from github api
//  2- clone each one

//  --------------------------------

const https = require('https');
const shell = require('shelljs');

module.exports.clone_all = function(username) {
    if(username)
      clone_all(username);
    else
      console.log("'username' required !!");
    return;
}

function clone_all(username) {

    var options = {
        hostname: "api.github.com",
        port: 443, //https
        path: "/users/" + username + "/repos?per_page=9999",
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        }
    };

    console.log(username);

    //change to http for local testing
    var req = https.get(options, function(res) {
        res.setEncoding('utf8');

        var body = '';

        res.on('data', function(chunk) {
            body = body + chunk;
        });

        res.on('end', function() {

            repos = JSON.parse(body);
            console.log(repos.length + ' repo found !!');

            shell.mkdir(username);
            shell.cd(username)

            for (var i = 0; i < repos.length; i++) {
                console.log((i + 1) + '- ' + repos[i].name);
                shell.exec('git clone ' + repos[i].clone_url);
                console.log('--------------');
            }

            if (res.statusCode != 200) {
                //callback("Api call failed with response code " + res.statusCode);
                console.log("Api call failed with response code " + res.statusCode);
                return;
            } else {
                //callback(null);
                return;
            }
        });

    });

    req.on('error', function(e) {
        console.log("Error : " + e.message);
        callback(e);
    });

    // write data to request body
    //req.write(post_data);
    req.end();

}