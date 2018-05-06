process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var Server = require('../server');

var mongoose = require('mongoose');

var should = chai.should();

chai.use(chaiHttp);

var Cache = require('../models/cache');

describe('Cache Server API', () => {
    beforeEach((done) => { //Before each test we empty the database
        Cache.remove({}, (err) => { 
           done();         
        });     
    });

    /*
    * Unit Test for GET ALL
    * 
    * */

    describe('GET All Cache Details', ()=>{
        //Get Empty list if the cache is empty
        it('it should GET empty cache list', (done)=>{
            chai.request(Server)
            .get('/api/v1/cache/')
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('message').eql('cache is empty');
                done();
            }) 
        })

        //Get All the cache details if the cache is not empty
        it('it should GET a list of cache', (done) => {
            let new_cache = new Cache({ key : "new_cache", value : "randomstring" });
            new_cache.save((err, cache) => {
                chai.request(Server)
                .get('/api/v1/cache/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('cache fetched successfully');
                    done();
                });
            })
        });    
    })


    /*
    * Unit Test for GET CACHE BY KEY Method
    * 
    * */

    describe('GET Cache Details By Key', ()=>{
        //Create new cache if key not exists
        it('it should GET New Cache', (done)=>{
            chai.request(Server)
            .get('/api/v1/cache/?key=testing')
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('message').eql('Cache Created Successfully');
                done();
            }) 
        })

        //Get cache details if key exists
        it('it should GET the cache details matching key', (done) => {
            let new_cache = new Cache({ key : "new_cache", value : "randomstring" });
            new_cache.save((err, cache) => {
                chai.request(Server)
                .get('/api/v1/cache/?key=new_cache')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('cache fetched successfully');
                    done();
                });
            })
        });    
    })

    /*
    * Unit Test for POST
    * 
    * */

    describe('POST New Cache Details By Key', ()=>{
        // POST NEW Cache
        it('it should POST New Cache', (done)=>{
            let new_cache = { key : "new_cache", value : "randomstring" };

            chai.request(Server)
            .post('/api/v1/cache/')
            .send(new_cache)
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.should.have.property('message').eql('Cache Created Successfully');
                done();
            }) 
        })

        // Update Existing Cache by Key
        it('it should PUT the cache details matching key if exists', (done) => {
            let new_cache = { key : "new_cache", value : "randomstringssdsdsd" };

            let old_cache = new Cache({ key : "new_cache", value : "randomstring" });
            old_cache.save((err, cache) => {
                chai.request(Server)
                .post('/api/v1/cache/')
                .send(new_cache)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('cache updated successfully');
                    done();
                });
            })
        });    
    })

    /*
    * Unit Test for PUT
    * 
    * */
    describe('Update Cache Details By Key', ()=>{
        //Update by Key
        it('it should Update the cache details matching key if exists', (done) => {
            let new_cache = { key : "new_cache", value : "randomstringssdsdsd" };

            let old_cache = new Cache({ key : "new_cache", value : "randomstring" });
            old_cache.save((err, cache) => {
                chai.request(Server)
                .put('/api/v1/cache/')
                .send(new_cache)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('cache updated successfully');
                    done();
                });
            })
        });    
    })

    /*
    * Unit Test for DELETE
    * 
    * */
    describe('Delete cache by key', () => {
        //Delete by Key
        it('it should DELETE the cache details matching key if exists', (done) => {
            let old_cache = new Cache({ key : "new_cache", value : "randomstring" });
            old_cache.save((err, cache) => {
                chai.request(Server)
                .delete('/api/v1/cache/?key=new_cache')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('cache deleted by key successfully');
                    done();
                });
            });
        });

        //Delete All
        it('it should DELETE all the cache', (done) => {
            let old_cache = new Cache({ key : "new_cache", value : "randomstring" });
            old_cache.save((err, cache) => {
                chai.request(Server)
                .delete('/api/v1/cache/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('data');
                    res.body.should.have.property('message').eql('All cache deleted successfully');
                    done();
                });
            });
        });
    });
});