var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server');

var should = chai.should();
var app = server.app;
var User = require('../models/userModel');


chai.use(chaiHttp);

describe('Lego Pieces', function() {
    before(function(done) {
        server.runServer(function() {
                app.request.isAuthenticated = function() { 
                return true; 
              } 
              
              
       User.create({username:'John',password:"timebang"}, function(error,newUsername){
              console.log(newUsername);
              app.request.user = newUsername;
              done();
       });
             
       
        });
    });



    after(function(done) {
        User.remove(function() {
            done();
        });
    });
    
    
     it('user should login on a POST', function(done) {
        chai.request(app)
            .post('/login')
            .send({username:"John", password:"timebang"})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
         
                done();
            });
    });

    
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/pieces')
            .send({partName:"Technic Beam 1 x 3 Thin", partId:"6632"})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.have.property('name');
                // res.body.should.have.property('_id');
                // res.body.name.should.be.a('string');
                // res.body._id.should.be.a('string');
               
                done();
            });
    });
    
    
   it('should get list of pieces', function(done) {
        chai.request(app)
            .get('/pieces')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
        
                done();
            });
    });
    
      
    
     it('should delete a piece on DELETE', function(done) {
         
         chai.request(app)
            .get('/pieces/')
            .end(function(err, res) {
                var itemId = res.body[0]._id;
                
                 chai.request(app)
                .delete('/pieces/'+itemId+'')
                .end(function(err, res) {
                     should.equal(err, null)
                     res.should.have.status(200)
                     res.should.be.json;
                     
                    chai.request(app).get('/pieces/').end(function(err, res){
                           res.body.length.should.equal(0);
                           done();
                      });
                  
            });
            
        });
    });
    
    
        it('should add a favorite piece on POST', function(done) {
        chai.request(app)
            .post('/pieces')
            .send({partName:"Technic Beam 1 x 3 Thin", partId:"6632"})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                // res.body.should.be.a('object');
                // res.body.should.have.property('name');
                // res.body.should.have.property('_id');
                // res.body.name.should.be.a('string');
                // res.body._id.should.be.a('string');
               
                done();
            });
    });
    
    
    
});    