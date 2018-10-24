const express = require('express');
const path = require('path');
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

app.post('/userData', function (req, res) {
  axios.post('https://github.com/login/oauth/access_token', {
    "client_id": "8c160841e901a6d02c3a",
    "client_secret": "25436e26f0efcbcdf295096f6c9166f5d216649a",
    "code": req.body.code,
    "redirect_uri": "http://localhost:3000/form",
    "state": "123456"
  }).then(function (response) {
    console.log(response.data.split('&')[0].split('=')[1]);
    getUserData(req, res,response.data.split('&')[0].split('=')[1]);
  }).catch(function (error) {
    console.log(error);
  });
})

//get user data
function getUserData(req, res,tocken) {
  axios.get('https://api.github.com/user?access_token=' + tocken)
    .then(function (userdata) {
      res.send(userdata.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

