const express = require('express');
const router = express.Router();
const MyDirectorObject = require('../models/Director');
const mongoose = require('mongoose');


router.post('/', function (req, res, next) {
    const Director = new MyDirectorObject(req.body);
    const promise = Director.save();
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

router.get('/', (req, res) => {

    const promise = MyDirectorObject.aggregate([{
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: { // Bu ilk id id'ye göre gruplandırılacağını söylüyor. Şimdi gelen data içinden hangi alanların gösterileceğini seçeceğiz. 
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


// Top 10 List
// Bunu üste yazmamızın nedeni iki get metodunun çakısmasıdır. 
router.get('/top10', (req, res) => {

    //MyDirectorObject.find({}, (err, data)=>{});
    // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 

    const promise = MyDirectorObject.find({}).limit(10).sort({
        imdb_score: -1
    });
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


router.get('/:directorId', (req, res) => {

    const promise = MyDirectorObject.aggregate([
        {
            $match: {
                '_id': mongoose.Types.ObjectId(req.params.directorId)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: { // Bu ilk _id id'ye göre gruplandırılacağını söylüyor. Şimdi gelen data içinden hangi alanların gösterileceğini seçeceğiz. 
                    _id: '$_id', // Bu _id içine aktarılan değişken
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                bio: '$_id.bio',
                movies: '$movies'
            }
        }
    ]);
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});


router.put('/:directorId', function (req, res, next) {

    const promise = MyDirectorObject.findByIdAndUpdate(req.params.directorId, req.body, {
        new: true
    });
    promise.then((gelenBilgi) => {
        if (!gelenBilgi) {
            res.json({
                message: "Böyle bir yönetmen yok.",
                code: 999
            });
        }
        res.json(gelenBilgi);
    }).catch((varsaHata) => {

        res.json(varsaHata);
    });
});

router.delete('/:directorId', function (req, res, next) {

    const promise = MyDirectorObject.findByIdAndRemove(req.params.directorId);
    promise.then((gelenBilgi) => {

        if (!gelenBilgi) {
            res.json({
                message: "Böyle bir yönetmen yok.",
                status: 999
            });
        }
        // Silme sonucunda gelenBilgiyi'yi yazmayıp kendi statusümüzü yazdıralım.
        res.json({
            status: 1,
            message:"Kayıt silindi."
        });
    }).catch((varsaHata) => {

        res.json(varsaHata);
    });
});


// Top 10 List
router.get('/between/:startYear/:endYear', (req, res) => {

    //MyDirectorObject.find({}, (err, data)=>{});
    // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 
    const {
        startYear,
        endYear
    } = req.params;
    const promise = MyDirectorObject.find({
        year: {
            "$gte": parseInt(startYear),
            "$lte": parseInt(endYear)
        }
    }).limit(10).sort({
        imdb_score: -1
    });
    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;