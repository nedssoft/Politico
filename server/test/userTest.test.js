import 'babel-polyfill';
import chai from 'chai';
import chaiHTTP from 'chai-http';
import passwordHash from 'password-hash';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;

const baseUrl = '/api/v1/auth';
const hashedPassword = passwordHash.generate('password');
const user = {
  firstName: 'First Name',
  lastName: 'Last Name',
  otherName: 'Other Name',
  phone: '07000000000',
  email: 'jondoe@gmail.com',
  passportUrl: 'https://example.com/lorem.jpg',
  isAdmin: true,
  password: hashedPassword,
};
describe('SIGN UP', () => {
  it('Should create user account', async () => {
    try {
      const res = await chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(user);
      expect(res).to.have.status(201);
      expect(res.body.data[0]).to.have.property('token');
      expect(res.body.data[0].user).to.be.an('object');
    } catch (err) {
      console.log(err);
    }
  });

  it('Should throw 400 if the fields are empty', (done) => {
    try {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors).to.be.an('array');
          expect(res.body.errors[0]).to.eq('First Name is required');
          expect(res.body.errors[1]).to.eq('Last Name is required');
          expect(res.body.errors[2]).to.eq('The phone number is required');
          expect(res.body.errors[3]).to.eq('Enter a valid phone number');
          expect(res.body.errors[4]).to.eq('Password is required');
          expect(res.body.errors[5]).to.eq('password cannot be less then 6 characters');
          expect(res.body.errors[6]).to.eq('Email is required');
          expect(res.body.errors[7]).to.eq('Invalid email');
          done();
        });
    } catch (err) {
      expect(err).to.have.status(500);
    }
  });
  it('Should throw 400 if first Name is empty', (done) => {
    user.firstName = '';
    try {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('First Name is required');
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
  it('Should throw 400 if last Name Name is empty', (done) => {
    user.lastName = '';
    user.firstName = 'First Name';
    try {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Last Name is required');
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
  it('Should throw 400 if email is empty', (done) => {
    user.email = '';
    user.firstName = 'First Name';
    user.lastName = 'Last Name';
    try {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Email is required');
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
  it('Should throw 400 if phone is empty', (done) => {
    user.phone = '';
    user.email = 'jondoe@gmail.com';
    user.firstName = 'First Name';
    user.lastName = 'Last Name';
    try {
      chai.request(app)
        .post(`${baseUrl}/signup`)
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The phone number is required');
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
});
describe('SIGN IN', () => {
  it('Should respond with status code 400 if email is emapty', async () => {
    const loginDetails = {
      email: '',
      password: 'password',
    };
    try {
      const res = await chai.request(app)
        .post(`${baseUrl}/login`)
        .send(loginDetails);

      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.eql('Email is required');
    } catch (err) {
      console.log(err);
    }
  });
  it('Should respond with status code 400 if email is invalid', (done) => {
    const loginDetails = {
      email: 'jondoegmail.com',
      password: 'password',
    };
    try {
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('Invalid email');
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
  it('Should respond with status code 401 if email is wrong', (done) => {
    const loginDetails = {
      email: 'jondoe1@gmail.com',
      password: 'password',
    };
    try {
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.eql('Invalid email or password');
          expect(res.body.error).to.equal(true);
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });
  it('Should respond with status code 401 if password is wrong', (done) => {
    const loginDetails = {
      email: 'jondoe@gmail.com',
      password: 'passwordd',
    };
    try {
      chai.request(app)
        .post(`${baseUrl}/login`)
        .send(loginDetails)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.eql('Invalid email or password');
          expect(res.body.error).to.equal(true);
          done();
        });
    } catch (err) {
      console.log(err);
    }
  });

  it('Should login user with correct credentials', async () => {
    try {
      const res = await chai.request(app)
        .post(`${baseUrl}/login`)
        .send(user);
      expect(res).to.have.status(200);
      expect(res.body.data[0]).to.have.property('token');
      expect(res.body.data[0].user).to.be.an('object');
      expect(res.body.message).to.eql('Login successful');
    } catch (err) {
      console.log(err);
    }
  });
});
