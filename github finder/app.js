const searchElement = document.getElementById("search");
const resultElement = document.getElementById("result");

searchElement.onkeyup = search;

//---------------------
class GithubUser {
    constructor(user) {
        this.user = user;
    }

    toHTML() {
        //let result = "";
        //result += `<a href='${this.userURL}'>${this.userName}</a>`;
        //result += "<br>";
        //console.log(this.user);
        return `
        <div class="card card-body mb-2">
            <div class="row">
                <div class="col-md-3">
                    <img class="img-fluid mb-2" src="${this.user.avatar_url}" alt="">
                    <a href="${this.user.html_url}" class="btn btn-primary mb-4">${this.user.login}</a>
                </div>
                <div class="col-md-9">
                    <span class="badge badge-primary">Public repos: ${this.user.public_repos}</span>
                    <span class="badge badge-success">Followers: ${this.user.followers}</span>
                    <span class="badge badge-primary">Following: ${this.user.following}</span>
                    <br>
                    <br>
                    <ul class="list-group">
                        <li class="list-group-item">Company: ${this.user.company}</li>
                        <li class="list-group-item">Blog: ${this.user.blog}</li>
                        <li class="list-group-item">Location: ${this.user.location}</li>
                        <li class="list-group-item">Member since: ${this.user.created_at}</li>
                    </ul>
                </div>
            </div>
        </div>
        <h3 class="page heading mb4">Lastest Repos</h3>
        <div id="repos">

        </div>
        `;
    }
}
//---------------------
class GithubRepository {
    constructor() {
        this.name = "";
        this.url = "";
        this.description = "";
    }

    toHTML() {
        let result = `
        <div class="card card-body mb-2">
            <div class="row">
                <div class="col-md-6">
                    <a href="$url">$name</a>
                </div>
                <div class="col-md-6">
                    <span class="badge badge-primary">Stars: $starsgazerscount</span>
                    <span class="badge badge-success">Watchers: </span>
                    <span class="badge badge-primary">Followers: </span>
                </div>
            </div>
        </div>
        `;
        return result;
    }
}
//---------------------
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
                    let user = new GithubUser(value);
                    result.push(user);
                });
                callback(status, result);
            }
        });
    }

    getRepositories(user, callback) {
        //console.log(`${this.url}users/${user.userName}/repos?client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxRepos}`);
        this.getJSON(`${this.url}users/${user.userName}/repos?client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxRepos}`, function(status, data) {
            if (status === 200) {
                let result = [];
                //console.log(data.length);
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
//---------------------

const github = new Github("https://api.github.com/", "8d42f4dc753eb6f1b180", "98222f8d8d60ffe189cb34cb65ad3025f1618b3d", 10, 5);

function search() {
    github.getUsers(searchElement.value, function(status, result) {
        if (status === 200) {
            let htmlString = "";
            result.forEach(function(value) {
                htmlString += "<div>";
                htmlString += value.toHTML();
                htmlString += "<hr>";
                github.getRepositories(value, function(status, result) {
                    result.forEach(function(value) {
                        htmlString += value.toHTML();
                        //console.log(value.toHTML());
                    });
                });
                htmlString += "</div>";
            });
            //console.log(htmlString);
            resultElement.innerHTML = htmlString;
        } else {
            resultElement.innerHTML = "Nothing founded";
        }
    });
}

