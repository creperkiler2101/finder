const searchElement = document.getElementById("search");
const resultElement = document.getElementById("result");

//Set up event handlers
searchElement.onkeyup = search;

//---------------------
class GithubUser {
    constructor() {
        this.avatarURL = "";
        this.userURL = "";
        this.userName = "";
    }

    toHTML() {
        let result = "";
        result += `<a href='${this.userURL}'>${this.userName}</a>`;
        result += "<br>";
        return result;
    }
}

class GithubRepository {
    constructor() {
        this.name = "";
        this.url = "";
        this.description = "";
    }

    toHTML() {
        let result = "";
        result += "<div>";
        result += `<a href='${this.url}'>${this.name}</a>`;
        result += "</div>";
        return result;
    }
}


class Github {
    constructor(url, clientId, secretId, maxUsers, maxRepos) {
        this.url = url;
        this.maxUsers = maxUsers;
        this.maxRepos = maxRepos;
        this.clientId = clientId;
        this.secretId = secretId;
    }

    getJSON(url, callback) {
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.responseType = "JSON";
        xmlRequest.open("GET", url);
        xmlRequest.onload = function() {
            callback(xmlRequest.status, JSON.parse(xmlRequest.response));
        }
        xmlRequest.send();
    }

    getUsers(query, callback) {
        this.getJSON(`${this.url}search/users?q=${query}&client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxUsers}`, function(status, data) {
            if (status === 200) {
                let result = [];
                data.items.forEach(function(value) {
                    let user = new GithubUser();
                    user.userName = value.login;
                    user.avatarURL = value.avatar_url;
                    user.userURL = value.html_url;
                    result.push(user);
                });
                callback(status, result);
            }
        });
    }

    getRepositories(user, callback) {
        console.log(`${this.url}users/${user.userName}/repos?client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxRepos}`);
        this.getJSON(`${this.url}users/${user.userName}/repos?client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxRepos}`, function(status, data) {
            if (status === 200) {
                let result = [];
                data.forEach(function(value) {
                    let repos = new GithubRepository();
                    repos.name = value.name;
                    repos.url = value.html_url;
                    repos.description = value.description;
                    result.push(repos);
                });
                callback(status, result);
            }
        });
    }
}

const github = new Github("https://api.github.com/", "8d42f4dc753eb6f1b180", "98222f8d8d60ffe189cb34cb65ad3025f1618b3d", 10, 5);

function search() {
    github.getUsers(searchElement.value, function(status, result) {
        if (status === 200) {
            let htmlString = "";
            result.forEach(function(value) {
                htmlString += "<div>";
                htmlString += value.toHTML();
                github.getRepositories(value, function(status, result) {
                    result.forEach(function(value) {
                        htmlString += value.toHTML();
                    });
                });
                htmlString += "</div>";
            });
            resultElement.innerHTML = htmlString;
        } else {
            resultElement.innerHTML = "Nothing founded";
        }
    });
}

