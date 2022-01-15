const axios = require('axios').default;

const isToday = (someDateEpoch) => {
    const today = new Date()
    const someDate = new Date(someDateEpoch)
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
}

function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function textLike(str) {
    var escaped = str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    return new RegExp(escaped, 'i');
}

function getMoney(value) {
    return Math.abs(Number(value)) >= 1.0e+9
    ? (Math.abs(Number(value)) / 1.0e+9).toFixed(2) + "B"
    : Math.abs(Number(value)) >= 1.0e+6
    ? (Math.abs(Number(value)) / 1.0e+6).toFixed(2) + "M"
    : Math.abs(Number(value)) >= 1.0e+3
    ? (Math.abs(Number(value)) / 1.0e+3).toFixed(2) + "K"
    : Math.abs(Number(value));
}

function largestInArray(arr) {
    return arr.sort((a,b)=>a-b).reverse()[0];
}

module.exports = { 
    isToday,
    randomString,
    textLike,
    getMoney,
    largestInArray,
}