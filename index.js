'user strict'

var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.port || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res) =>{
    if(err){
        throw err
    }else{
        console.log("La base de datos funciona");
        app.listen(port, function(){
            console.log("Servidor escucha " + port)
        });
    }
});