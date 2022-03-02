'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

function pruebas(req, res){
    res.status(200).send({
        message: 'Wenasssssss'
    });
}

function saveUser(req, res){
    var user = new User();{}
    var params = req.body;
    console.log(params);
    if(params.name != null && params.surname != null && params.email != null){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = 'null';
        if(params.password){
            bcrypt.hash(params.password, null, null, function(err, hash){
                user.password = hash; 
            });
        }else{
            res.status(500).send({message: 'Introduce la contraseña'});
        }
    }else{
        res.status(500).send({message: 'Rellene todos los campos'});
    }
}

module.exports = {
    pruebas,
    saveUser
};