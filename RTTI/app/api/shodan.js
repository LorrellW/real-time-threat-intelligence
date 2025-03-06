// /api/shodan.js
const fetch = require('node-fetch');
const API_KEY = process.env.SHODAN_API_KEY;
const IP = '8.8.8.8';
const URL = `https://api.shodan.io/shodan/host/${IP}?key=${API_KEY}`;

fetch(URL)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
