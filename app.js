const searchElement = document.getElementById("search");
const resultElement = document.getElementById("result");

searchElement.onkeyup = search;

//---------------------
class GithubUser {
    constructor(user) {
        this.user = user;
    }

    toHTML() {
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
        `;
    }
}
//---------------------
class GithubRepository {
    constructor(repos) {
        this.repos = repos;
    }

    toHTML() {
        let result = `
            <div class="row">
                <div class="col-md-6">
                    <a href="${this.repos.url}">${this.repos.name}</a>
                </div>
                <div class="col-md-6">
                    <span class="badge badge-primary">Stars: </span>
                    <span class="badge badge-success">Watchers: </span>
                    <span class="badge badge-primary">Followers: </span>
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

    async getUsers(query, callback) {
        let searchResponse = await fetch(`${this.url}search/users?q=${query}&client_id=${this.clientId}&client_secret=${this.secretId}&per_page=${this.maxUsers}`);
        let searchResult = await searchResponse.json();
        let result = [];
        searchResult.items.forEach(async function(value) {
            let userResponse = await fetch(`https://api.github.com/users/${value.login}?client_id=8d42f4dc753eb6f1b180&client_secret=98222f8d8d60ffe189cb34cb65ad3025f1618b3d`);
            let user = await userResponse.json();
            result.push(new GithubUser(user));

            if (result.length == searchResult.items.length) {
                callback(result);
            }
        });
    }

    async getRepositories(user, callback) {
        let searchResponse = await fetch(`${this.url}users/${user.user.login}/repos?client_id=${this.clientId}&client_secret=${this.secretId}&per_page=5`);
        let searchResult = await searchResponse.json();
        let result = [];
        console.log(searchResult.length);
        searchResult.forEach(async function(value) {
            result.push(new GithubRepository(value));

            if (result.length == searchResult.length) {
                callback(result);
            }
        });
    }
}
//---------------------

const github = new Github("https://api.github.com/", "8d42f4dc753eb6f1b180", "98222f8d8d60ffe189cb34cb65ad3025f1618b3d", 10, 5);

async function search() {
    resultElement.innerHTML = "";
    github.getUsers(searchElement.value, function(users) {
        users.forEach(function(user) {
            github.getRepositories(user, function(repos) {
                draw(user, repos);
            });
        });
    });
}

function draw(user, repos) {
    resultElement.innerHTML += user.toHTML();
    resultElement.innerHTML += "cba";
    resultElement.innerHTML += "<div>";
    resultElement.innerHTML += "abc";
    repos.forEach(function(value) {
        resultElement.innerHTML += value.toHTML();
    });
    resultElement.innerHTML += `</div>`;
}

