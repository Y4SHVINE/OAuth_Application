const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require("crypto");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

// Views
app.get('/', function (req, res) {
  res.render('views/index', { msg: "", className: "" });
});
app.get('/form', function (req, res) {
  res.render('views/form');
});


app.get('/token', function (req, res) {
  res.json(req.session.csrf);
});

app.post('/login', function (req, res) {
  axios.post('https://github.com/login/oauth/access_token', {
    "client_id": "8c160841e901a6d02c3a",
    "client_secret": "25436e26f0efcbcdf295096f6c9166f5d216649a",
    "code": req.body.code,
    "redirect_uri": "http://localhost:3000/form",
    "state": "123"
  }).then(function (response) {
    res.send({ "access_token": response.data.split('&')[0].split('=')[1] })
  }).catch(function (error) {
    console.log(error);
  });
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

