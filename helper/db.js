const mongoose = require('mongoose');


module.exports = ()=>{
mongoose.connect('mongodb://mustafa:ab12345@ds125693.mlab.com:25693/mymoviedb');
mongoose.connection.on('open', ()=>{
    console.log('MongoDb: Connected');
});
mongoose.connection.on('error', (err)=>{
    console.log('MongoDb: Error' , err);
});

// mongoose movie.save komutunda callback kullanılması yerine Promise yapısını önerdiği için alttaki bir satır kodu ekleyerek mongoose ile promise kullanmaya başlayacağız. 
mongoose.Promise=global.Promise;
};