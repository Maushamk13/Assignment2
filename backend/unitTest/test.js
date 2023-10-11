const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../server'); // Import your Express app

chai.use(chaiHttp);

describe('Server Unit Tests', () => {
  // Test your user creation route
  it('should create a new user', (done) => {
    const newUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@example.com',
      password: 'securePassword',
      role: 'user',
      group: []
    };

    chai.request(app)
      .post('/user/create')
      .send(newUser)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.true;
        expect(res.body.message).to.equal('User created successfully');
        done();
      });
  });

  // Test your login route
  it('should validate a user login', (done) => {
    const credentials = {
      email: 'johndoe@example.com',
      password: 'securePassword'
    };

    chai.request(app)
      .post('/user/login')
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.true;
        expect(res.body.message).to.equal('User Validated Successfully');
        expect(res.body.user).to.have.property('firstname', 'John');
        done();
      });
  });

  // Test your get all users route
  it('should retrieve all users', (done) => {
    chai.request(app)
      .get('/user/all')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.be.true;
        expect(res.body.message).to.equal('All users retrieved successfully');
        expect(res.body.users).to.be.an('array');
        done();
      });
  });
});
