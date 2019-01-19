const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;
describe('/api/movies testi', () => {
    before('token getiren test',(done) => {
        chai.request(server)
            .post('/login')
            .send({
                username: 'mkarcioglu3',
                password: '123456'
            })
            .end((err, res) => {
                token = res.body.token;
                console.log(token);
                done();
            });
    });
    describe('1. get data from api movies', () => {
        it('it should get all movies', (done) => {
            chai.request(server)
                .get('/api/movies')
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    describe('2. post a movie',()=>{
        it('it should post a movie', (done)=>{
            const testmovie= {
                title:'Test Filmi4',
                category:'Komedi',
                year:1983,
                imdb_score:9
            };
            chai.request(server)
            .post('/api/movies')
            .set('x-access-token', token)
            .send(testmovie)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title');
                res.body.should.have.property('category');
                res.body.should.have.property('year');
                res.body.should.have.property('imdb_score');
                movieId=res.body._id;
                done();
            });
        });
    });
    describe('3. get spesific movie data from api movies', () => {
        it('it should get a movie', (done) => {
            
            chai.request(server)
                .get('/api/movies/'+movieId)
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('category');
                    res.body.should.have.property('year');
                    res.body.should.have.property('_id').eql(movieId);
                    done();
                });
        });
    });
    describe('4. update a movie',()=>{
        it('it should update a movie', (done)=>{
            const testmovie= {
                title:'Update6',
                category:'Komedi',
                year:1983,
                imdb_score:9
            };
            chai.request(server)
            .put('/api/movies/'+movieId)
            .set('x-access-token', token)
            .send(testmovie)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('title').eql(testmovie.title);
                res.body.should.have.property('category').eql(testmovie.category);
                res.body.should.have.property('year').eql(testmovie.year);
                res.body.should.have.property('imdb_score').eql(testmovie.imdb_score);
    
                done();
            });
        });
    });
    describe('5. delete a movie',()=>{
        it('it should delete a movie', (done)=>{
            
            chai.request(server)
            .delete('/api/movies/'+movieId)
            .set('x-access-token', token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);   
                done();
            });
        });
    });
});