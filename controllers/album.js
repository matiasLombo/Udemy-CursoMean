'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;
    Album.findById(albumId, (err, album) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!album){
                res.status(404).send({message: 'El album no existe'}); 
            }else{
                res.status(200).send({album}); 
            }
        }
    })
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el album'});  
        }else{
            if(!albumStored){
                res.status(404).send({message: 'El album no ha sido guardado'});  

            }else{
                res.status(200).send({album: albumStored});
            }
        }
    })
}

function getAlbums(req, res){
    var page = req.params.page;
    if(req.params.page){
        var page = req.params.page;

    }else{
        var page = 1;
    }
    var itemsPerPage = 3;
    Album.find().sort('title').paginate(page, itemsPerPage, function(err, albums, total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!albums){
                res.status(404).send({message: 'No hay albums'}); 
            }else{
                return res.status(200).send({
                    total_items: total,
                    albums: albums
                }); 
            }
        }
    })
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el album'});
        }else{
            if (!albumUpdated) {
                res.status(404).send({message: 'No se pudo actualizar al album'});
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;
    Album.find({album: albumId}).remove((err, albumRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el album'});
        }else{
            if (!albumRemoved) {
                res.status(404).send({message: 'No se pudo eliminar al album'});
            }else{
                Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la cancion'});
                    }else{
                        if (!songRemoved) {
                            res.status(404).send({message: 'No se pudo eliminar la cancion'});
                        }else{
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });           
            }
        }        
    });
}

function uploadImage(req, res){
    var albumId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){
        var file_path = req.files.image.path;
        console.log({file_path});
        var file_split = file_path.split('\\');
        console.log({file_split});
        var file_name  = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) =>{
                if (!albumUpdated) {
                    res.status(404).send({message: 'No se pudo actualizar la imagen'});
                }else{
                    res.status(200).send({album: albumUpdated});
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
    var image_file = req.params.image;
    console.log({image_file});
    var path_file = './uploads/albums/' + image_file;
    console.log({path_file});
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file))
        }else{
            res.status(200).send({message: 'La imagen no existe'});
        }
    })
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}