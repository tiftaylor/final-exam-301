'use strict';

// =================== Packages ===================== //
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();



// =================== Global Variables ===================== //
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL);
const app = express();


// ================= Express Configs ====================//
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => console.error(error));


// ===================== Routes ======================= //
app.get('/', homePageList);
app.get('/add', savePokemon);
app.post('/favorites', displayFaves);


// ========================== Route Handlers ============================ //
function homePageList (req, res) {
  const pokeURL = 'https://pokeapi.co/api/v2/pokemon/'
  
  superagent.get(pokeURL)
    .then(resultData => {

      const arrayFromBody = resultData.body.results;
      const makeList = arrayFromBody.map(obj => new Pokemon(obj));

      res.render('pages/show', {
        array: sort('name', makeList)
      });
    })
}


function savePokemon (req, res) {
  const {name} = req.body;

  const addData = `INSERT INTO pokemon
    (name)
    VALUES($1)`;
  const valueArray = [name];

  client.query(addData, valueArray).then(() => {
    res.redirect('/')
  })
}


function displayFaves (req, res) {
  client.query(`SELECT name FROM pokemon`)
    .then(dbResult => {
      const dbData = dbResult.rows;
      res.render('pages/favorites', {
        array: dbData
      });
    })
}


// =================== Misc. Functions ===================== //
function Pokemon(obj) {
  this.name = obj.name;
};


function sort(prop, arr){
  const alpha = arr.sort((a, b) => (a[prop] > b[prop]) ? 1 : -1);
  return alpha;
};


function errorHandler(error, res) {
  res.status(500).render('pages/error', {
    status: error.status,
    message: error.message
  });
};

client.connection.on('message', function(msg) {
  console.log(msg.name)
 })
 
 client.connection.on('connect', function() {
  console.log('connected')
 })
 
 client.connection.stream.on('connect', function() {
  console.log('stream connected')
 })
// =================== Start Server ===================== //
client.connect().then( () => {
    console.log('something');
    app.listen(PORT, () => console.log('Ay! We\'re connected'));
  })
  .catch(err => console.error('connection error', err.stack));
