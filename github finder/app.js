const oDiv = "<div>";
const cDiv = "</div>";

const searchId = "search";
const resultId = "result";
const apiLink = "https://api.github.com";
const userLink = "/search/users?q=";

const searchElement = document.getElementById(searchId);
const resultElement = document.getElementById(resultId);

class ResultBlock {
    constructor() {
        this.avatarURL = "";
        this.userURL = "";
        this.userName = "";
    }

    toHTMLString() {
        let result = "";
        result += oDiv;
        result += `<img style="width: 50px; height: 50px;" src='${this.avatarURL}' alt=''>`;
        result += `<a href='${this.userURL}'>${this.userName}</a>`;
        result += cDiv;

        return result;
    }
}

function getJSON(url, callback) {
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.responseType = "JSON";
    xmlRequest.open("GET", url);
    xmlRequest.onload = function() {
        callback(xmlRequest.status, JSON.parse(xmlRequest.response));
    }
    xmlRequest.send();
}

function search() {
    let elementsResult = "";
    getJSON(apiLink + userLink + searchElement.value, function(status, result) {
        result.items.forEach(function(value) {
            let block = new ResultBlock();
            block.avatarURL = value.avatar_url;
            block.userURL = value.html_url;
            block.userName = value.login;
            elementsResult += block.toHTMLString();
        });

        resultElement.innerHTML = elementsResult;
    });
}

searchElement.onkeyup = search;

