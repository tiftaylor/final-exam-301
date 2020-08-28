'use strict';

// =================== Packages ===================== //
const express = require('express');
const app = express();
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();


// =================== Global Variables ===================== //
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);


// ================= Express Configs ====================//
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));
client.on('error', (error) => console.error(error));


// ===================== Routes ======================= //
app.get('/', homePageList);
app.post('/add', savePokemon);
app.get('/favorites', displayFaves);
app.post('/', gotoFave);


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
    .catch(error => errorHandler(error, res));
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
  .catch(error => errorHandler(error, res));
}


function displayFaves (req, res) {
  client.query(`SELECT name FROM pokemon`)
    .then(dbResult => {
      const dbData = dbResult.rows;
      res.render('pages/favorites', {
        array: dbData
      });
    })
    .catch(error => errorHandler(error, res));
}


function gotoFave (req, res) {
  res.redirect('/favorites');
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


// =================== Start Server ===================== //
console.log('you made it to line 93');

client.connect().then(() => {
  console.log('Did it enter on your computer?');
  app.listen(PORT, () => console.log('Ay! We\'re connected'));
})
.catch(err => console.error('connection error', err.stack));

// const pg = require('pg');
// const DATABASE_URL = 'postgres://http://localhost:5432/poke_app';
// const client = new pg.Client(DATABASE_URL);
// client.on('error', (error) => console.error(error));


// new Promise(() => {
//   client.connect()
//     .then( () => console.log('yay'))
//     .catch(err => console.error('connection error', err.stack));
// })
// .then( () => console.log('yay'))
// .catch(err => console.error('connection error', err.stack));