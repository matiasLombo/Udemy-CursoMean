'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: 'Wenasssssss'
    });
}

function saveUser(req, res){
    var user = new User();{}
    var params = req.body;
    console.log(params);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';
    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash; 
            if(params.name != null && params.surname != null && params.email != null){
                user.save((err, userStrored) => {
                    if(err){
                        res.status(500).send({message: 'Error al guardar al usuario'});
                    }else{
                        if(!userStrored){
                            res.status(404).send({message: 'No se ha registrado al usuario'});
                        }else{
                            res.status(200).send({user: userStrored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Rellene todos los campos'});
            }
        });
    }else{
        
    }     
}

function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},(err, user) =>{
        if(err){
            res.status(500).send({message: 'Error al iniciar sesion'})
        }else{
            if(!err){
                res.status(404).send({message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.getHash){
                            res.status(200).send({
                                token: jwt.createToken({user})
                            })
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'Contraseña Incorrecta'});
                    }
                });
            }
        }
    });
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }else{
            if (!userUpdated) {
                res.status(404).send({message: 'No se pudo actualizar al usuario'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res){
    var userId = req.params.id;
    var file_name = 'No subido';
    
    if(req.files){
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name  = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) =>{
                if (!userUpdated) {
                    res.status(404).send({message: 'No se pudo actualizar al usuario'});
                }else{
                    res.status(200).send({user: userUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Formato de imagen no soportado'});
        }

    }else{
        res.status(200).send({message: 'No ha subido imagen'});
    }
}

function getImageFile(req, res){
    var image_file = req.params.imagenFile;
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file))
        }else{
            res.status(200).send({message: 'La imagen no existe'});
        }
    })
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};