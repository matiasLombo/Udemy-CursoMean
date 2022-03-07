'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePagination = require('mongoose-pagination');

var song = require('../models/song');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;
    Song.findById(songId, (err, song) =>{
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!song){
                res.status(404).send({message: 'La cancion no existe'}); 
            }else{
                res.status(200).send({song}); 
            }
        }
    })
}

function saveSong(req, res){
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.song = params.song;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Error al guardar la cancion'});  
        }else{
            if(!songStored){
                res.status(404).send({message: 'La cancion no ha sido guardado'});  

            }else{
                res.status(200).send({song: songStored});
            }
        }
    })
}

function getSongs(req, res){
    var page = req.params.page;
    if(req.params.page){
        var page = req.params.page;

    }else{
        var page = 1;
    }
    var itemsPerPage = 3;
    Song.find().sort('name').paginate(page, itemsPerPage, function(err, songs, total){
        if(err){
            res.status(500).send({message: 'Error en la peticion'}); 
        }else{
            if(!songs){
                res.status(404).send({message: 'No hay canciones'}); 
            }else{
                return res.status(200).send({
                    total_items: total,
                    songs: songs
                }); 
            }
        }
    })
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el song'});
        }else{
            if (!songUpdated) {
                res.status(404).send({message: 'No se pudo actualizar al song'});
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res){
    var songId = req.params.id;
    Song.find({song: songId}).remove((err, songRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la cancion'});
        }else{
            if (!songRemoved) {
                res.status(404).send({message: 'No se pudo eliminar la cancion'});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    });    
}


function uploadFile(req, res){
    var songId = req.params.id;
    var file_name = 'No subido...';
    
    if(req.files){
        var file_path = req.files.file.path;
        console.log({file_path});
        var file_split = file_path.split('\\');
        console.log({file_split});
        var file_name  = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        
        if (file_ext == 'mp3' || file_ext == 'ogg') {
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) =>{
                if (!songUpdated) {
                    res.status(404).send({message: 'No se pudo actualizar la cancion'});
                }else{
                    res.status(200).send({song: songUpdated});
                }
            });
        }else{
            res.status(200).send({message: 'Formato de audio no soportado'});
        }

    }else{
        res.status(200).send({message: 'No ha subido imagen'});
    }
}

function getSongFile(req, res){
    var song_file = req.params.file;
    console.log({song_file});
    var path_file = './uploads/songs/' + song_file;
    console.log({path_file});
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file))
        }else{
            res.status(200).send({message: 'La archivo de audio no existe'});
        }
    })
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}