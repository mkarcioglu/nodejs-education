var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const MyUserObject = require('../models/User');
const mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({message:"hello"});
});
router.post('/', function(req, res, next) {
  res.status(200).send({message:"hello"});
});


router.post('/register', function(req, res, next) {
    
  //const User=new MyUserObject(req.body);
  // Üstteki satır ile kaydedebilirdik ama password'u bcrypt ile şifreleyeceğimiz için alttaki gibi aktaralım.
  const {username, password}=req.body;
  bcrypt.hash(password, 10).then((hash)=>{
    const user=new MyUserObject({username, password:hash});  
      const promise = user.save();
      promise.then((data) => {
          res.json(data);
      }).catch((err) => {
          res.json(err);
      });
  });
  
});

router.post('/login', function(req, res, next) {

  
  const {username, password}=req.body;

  MyUserObject.findOne({
    username
  }, (err, user)=>{

    // Eğer işlem sırasında bir hata oluştuysa hata verelim.
    if (err) res.status(500).json({status:false, message: "Something went wrong. Try again later."});
    // Eğer sorgu yapılıp sonuç döndüyse iki olasılık var; ya bu kullanıcı sistemde vardır ya da yoktur. Önce kullanıcının bulunamadığı durumu ele alalım.
    if(!user){
      // Kullanıcı yoksa ilgili mesajı gönderiyoruz.
      res.status(404).json({status:false, message: "Authentication failed. User not found!"});
    }
    else{
      // Burası çalıştıysa kullanıcı var demektir. O halde bu kullanıcının şifresi ya doğrudur ya da yanlış. Bunu ele alalım.
      const _id= user._id; // Bu satırı parola doğruysa id'sini de göndermek istediğimden ekledim. İlerde buna ad soyad okul bilgisi gibi şeyler de eklenecek. Bunun algoritma veya authentication ile bir ilgisi yok. Bakalım şifre doğru mu -->

      // Şifrenin doğru mu yanlış mı olduğunu ele alıyoruz. 
      bcrypt.compare(password, user.password).then((result)=>{

        // burada result değeri true ya da false dönüyor.
        if(!result){
          // Şifre hatalıysa ilgili mesajı gönderelim. 
          res.status(404).json({status:false, message: "Authentication failed. Wrong password!"});
        } else {
          // Şifre doğruysa kullanıcıya tekrar tekrar login yapmaması için bir adet token verelim.
          // Bu token username ifadesini içersin.. 
          const payload={
            username,
            _id
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn:86400 // Saniye cinsinden giriliyor. 86400 saniye=24 saat. Bu ifade 86400*7 şeklinde de(bir hafta) girilebilir.
        });

          res.status(200).json({status:true, token:token, _id, username});
        }
      }).catch((err)=>{
        res.status(500).json({status:false, message:"Internal server error!"});
      });
    }
  
  });
  
  
});

module.exports = router;
