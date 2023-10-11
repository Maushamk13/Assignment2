const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../server'); // Adjust the path to your server file
const userModel = require('../user/userModel'); // Import your user model

const request = supertest(app);

describe('Integration Tests', () => {
  let userToken; // Store the authentication token for a user

  before(async () => {
    // Create a test user and store the token
    const testUser = {
      firstname: 'Test',
      lastname: 'User',
      email: 'testuser@example.com',
      password: 'testpassword',
      role: 'user',
      group: [],
    };

    // Create the test user in the database
    await userModel.create(testUser);

    // Log in the test user and store the token
    const credentials = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request.post('/user/login').send(credentials);
    userToken = response.body.token;
  });

  describe('User API', () => {
    it('should create a new user', (done) => {
      const newUser = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@example.com',
        password: 'securePassword',
        role: 'user',
        group: [],
      };

      request
        .post('/user/create')
        .send(newUser)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.be.true;
          expect(res.body.message).to.equal('User created successfully');
          done();
        });
    });

    it('should retrieve all users', (done) => {
      request
        .get('/user/all')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.be.true;
          expect(res.body.message).to.equal('All users retrieved successfully');
          expect(res.body.users).to.be.an('array');
          done();
        });
    });
  });


  after((done) => {
    // Perform any cleanup or teardown here if necessary
    done();
  });
});
