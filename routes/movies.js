const express = require('express');
const router = express.Router();
const MyMovieObject=require('../models/Movie');


router.post('/', function(req, res, next) {
  /* const {title, category, year, imdb_score, country }= req.body;
  // bu şekilde aktarmak alttaki Movie nesnesinin içinde title: req.body.title, category:req.body.category... diyerek tek tek atamaktan daha kolay oldu. Ecmascript6 ile gelen destructing özelliği sayesinde mümkün oldu.
  const Movie =new MyMovieObject({
    title: title,  
    category: category,
    year: year,
    imdb_score: imdb_score,
    country: country

  }); */

  // Üstte comment edilen bölümün yerine alttaki tek satır kullanılabilir.
  const Movie = new MyMovieObject(req.body);

  /* Movie.save((err, data)=>{
    if(err)
      res.json(err);
    res.json(data);
  }); */

  // db.js içinde, mongoose ile birlikte kullanılmak üzere global bir Promise yapısı tanımladık. O tanım sayesinde mongoose'un save metodunu promise yapısı ile kullanabiliyoruz. Zira save metodu bir callback fonksiyon çağırıyordu. Artık promise yapısı sayesinde error ve datayı üstteki callback fonksiyonu yerine promise ile ekrana yazdırabiliyoruz. Mongoose promise kullanımını tavsiye ettiği için bu şekilde oluyor.  
  const promise=Movie.save();
  promise.then((data)=>{
   res.json(data); 
  }).catch((err)=>{
    res.json(err);
  });
});

router.get('/', (req, res)=>{

  //MyMovieObject.find({}, (err, data)=>{});
  // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 

  // const promise=MyMovieObject.find({ });
  // promise.then((data)=>{
  //   res.json(data);
  // }).catch((err)=>{res.json(err);
  // });

  //* Üstteki bölüm tüm filmleri listeliyor ancak yönetmenleri getirmiyor. Yönetmenleri getirmesi için aggregate ile yeniden programlayacağız.

  const promise=MyMovieObject.aggregate([
    {
      $lookup:{
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as : 'director'
      }
    },
    {
        $unwind: {
            path: '$director',
            preserveNullAndEmptyArrays: true
        }
    },// Gruplamaya gerek yok aslında. Sadece iç içe json objeleri oluşmasın diye grupluyoruz. 
    {
      $group:{
        _id:{
          _id:'$_id',
          title:'$title',
          category:'$category',
          year:'$year',
          imdb_score:'$imdb_score',
          directorName:'$director.name',
          directorSurname:'$director.surname',
          director_id:'$director_id'
        }
      }
    }
    
  ]);
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{res.json(err);
  });
});


// Top 10 List
// Bunu üste yazmamızın nedeni iki get metodunun çakısmasıdır. 
router.get('/top10', (req, res)=>{

  //MyMovieObject.find({}, (err, data)=>{});
  // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 

  const promise=MyMovieObject.find({ }).limit(10).sort({imdb_score: -1});
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{res.json(err);});
});


  router.get('/:movieId', (req, res)=>{

    
    //MyMovieObject.find({}, (err, data)=>{});
    // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 
  
    const promise=MyMovieObject.findById(req.params.movieId);

    // Burada promise mantığını kavramış bulunuyoruz. MyMovieObject objesi ile findById() metodu sonunda dönen değer promise nesnesi içine düşüyor.(Aslında mongoose'un tüm metodları sonunda bir promise değeri dönüyor. data veya error içeriyor.) Hemen alttaki komut dizisi içinde promise.then(data) diyerek, promise'e gelen data'yı then içerisine alıp basıyoruz. eğer üstteki FindById işleminde bir hata oluştuysa, promise'e hata döneceği için catch ile gelen hatayı yakalayıp bastırıyoruz. 
    promise.then((gelenBilgi)=>{
      if(!gelenBilgi){
        res.json({status: false, message: "Böyle bir film yok.", code:999});
      }
      res.json(gelenBilgi);
    }).catch((varsaHata)=>{
      
      res.json(varsaHata);});
  });

  router.put('/:movieId', function(req, res, next) {
  
    const promise= MyMovieObject.findByIdAndUpdate(req.params.movieId, req.body, {new: true});
    promise.then((gelenBilgi)=>{
      if(!gelenBilgi){
        res.json({status:false, message: "Böyle bir film yok.", code:999});
      }
      res.json(gelenBilgi);
    }).catch((varsaHata)=>{
      
      res.json(varsaHata);});
  });
  
  router.delete('/:movieId', function(req, res, next) {
  
    const promise= MyMovieObject.findByIdAndRemove(req.params.movieId);
    promise.then((gelenBilgi)=>{

      if(!gelenBilgi){
        res.json({status:false, message: "Böyle bir film yok.", code:999});
      }
      // Silme sonucunda gelenBilgiyi'yi yazmayıp kendi statusümüzü yazdıralım.
      res.json({status: 1});
    }).catch((varsaHata)=>{
      
      res.json(varsaHata);});
  });


// Top 10 List
router.get('/between/:startYear/:endYear', (req, res)=>{

  //MyMovieObject.find({}, (err, data)=>{});
  // Normalde find metodunu üstteki gibi kullanırdık. Artık promise ile kullanacağız. 
const {startYear, endYear}=req.params;
  const promise=MyMovieObject.find(
    {
      year :{ "$gte": parseInt(startYear), "$lte": parseInt(endYear)}
     }).limit(10).sort({imdb_score: -1});
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{res.json(err);});
});

module.exports = router;
