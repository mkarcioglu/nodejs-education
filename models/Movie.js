const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    director_id: Schema.Types.ObjectId,
    title:{
        type: String,
        // required: true
        // Üstteki satırın yerine kendi mesajımızı verebileceğimiz alttaki bir satırı ekliyoruz.
        required:[true, 'Film adı girilmesi zorunludur.'],
        maxlength: [30, 'Film adı 30 karakterden fazla olamaz. '],
        minlength: [1, 'Film adı 1 karakterden az olamaz. ']

    },
    category: String,
    country: String,
    year: {
        type:Number,
        max:2040,
        min:1900},
        // String ifadelerde maxlength ve minlength kullanılıyor. Number türü ifadelerde max ve min kullanılıyor.
    imdb_score: Number,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);