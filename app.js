'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
 
//carga rutas
var user_routes = require('./routes/user')

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// config cabeceras http

//rutas base
app.use('/api', user_routes);

module.exports = app;