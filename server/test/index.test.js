import chai from 'chai';
import chaiHTTP from 'chai-http';
import passwordHash from 'password-hash';
import app from '../app';
import Authenticator from '../helpers/Authenticator';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/parties';
const officeBaseUrl = '/api/v1/offices';
const hashedPassword = passwordHash.generate('password');
const admin = {
  firstName: 'First Name2',
  lastName: 'Last Name2',
  otherName: 'Other Name2',
  phone: '07000000080',
  email: 'jondoe2@gmail.com',
  passportUrl: 'https://example.com/lorem.jpg',
  isAdmin: true,
  password: hashedPassword,
};
const user = {
  firstName: 'test',
  lastName: 'user',
  otherName: 'Other Name2',
  phone: '07000000010',
  email: 'testuser@gmail.com',
  passportUrl: 'https://example.com/lorem.jpg',
  // isAdmin: true,
  password: hashedPassword,
};
let token;
let userToken;
const { generateToken, verifyToken } = Authenticator;

describe('App', () => {
  it('The server should be running', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
describe('JWT', () => {
  let testToken;
  const payload = { id: 1, isAdmin: true };
  it('should generate token', (done) => {
    testToken = generateToken(payload);
    expect(testToken).to.be.a('string');
    expect(testToken).to.be.have.lengthOf.above(32);
    done();
  });
  it('should verify  testToken', (done) => {
    const verifiedToken = verifyToken(testToken);
    expect(verifiedToken.id).to.eql(1);
    expect(verifiedToken.isAdmin).to.equal(true);
    done();
  });
});
describe('Test Party Endpoints', () => {
  /* eslint-disable no-unused-expressions */
  describe('POST REQUESTS', () => {
    before(async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(admin);
        token = res.body.data[0].token;
      } catch (err) {
        console.log(err);
      }
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signup')
          .send(user);
        userToken = res.body.data[0].token;
      } catch (err) {
        expect(err).to.have.status(500);
      }
    });

    it('It should ensure that party name is not empty', (done) => {
      const newParty = {
        name: '',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newParty)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The party name is required');
          done();
        });
    });
    it('It should ensure that party hqAddress is not empty', (done) => {
      const newParty = {
        name: 'Test Party',
        hqAddress: '',
        logoUrl: 'test-logo.png',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newParty)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The party HQ Address is required');
          done();
        });
    });

    it('It should ensure that party logoUrl is not empty', (done) => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: '',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newParty)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The party logo is required');
          done();
        });
    });
    it('It should respond with 401 if token is not provided', async () => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      try {
        const res = await chai.request(app)
          .post(baseUrl)
          .send(newParty);
        expect(res).to.have.status(401);
        expect(res.body.message).to.eql('Only an Admin has the right to create a party');
      } catch (err) {
        console.log(err);
      }
    });
    it('It should ensure the user is an admin', async () => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      try {
        const res = await chai.request(app)
          .post(baseUrl)
          .send(newParty)
          .set('token', userToken)
          .set('Authorization', userToken);
        expect(res).to.have.status(401);
        expect(res.body.message).to.eql('Only an Admin has the right to create a party');
      } catch (err) {
        console.log(err);
      }
    });
    it('It should create the new political party', async () => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      try {
        const res = await chai.request(app)
          .post(baseUrl)
          .send(newParty)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(201);
        expect(res.body.data).to.be.an('object');
      } catch (err) {
        console.log(err);
      }
    });

    it('It should respond with status 409 if party already exists', async () => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      try {
        const res = await chai.request(app)
          .post(baseUrl)
          .send(newParty)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(409);
        expect(res.body.error).to.eql('The party already exists');
      } catch (err) {
        console.log(err);
      }
    });
  });
  describe('GET REQUESTS', () => {
    it('should respond with status code 404 if party does not exists', (done) => {
      const id = 5;
      chai.request(app)
        .get(`${baseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Party with ID: ${id} Not Found`);
          done();
        });
    });

    it('should respond with status code 400 if partyId is not a number', (done) => {
      const id = 'dd';
      chai.request(app)
        .get(`${baseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The party ID must be an integer');
          done();
        });
    });

    it('should get all parties record', async () => {
      try {
        const res = await chai.request(app)
          .get(baseUrl);
        expect(res).to.have.status(200);
      } catch (err) {
        console.log(err);
      }
    });
    it('should get a single party with a given Id', async () => {
      const id = 1;
      try {
        const res = await chai.request(app)
          .get(`${baseUrl}/${id}`);
        expect(res).to.have.status(200);
      } catch (err) {
        console.log(err);
      }
    });
  });
  describe('PATCH REQUEST', () => {
    it('should respond with status code 404 id the party does not exist', async () => {
      const id = 9;
      try {
        const res = await chai.request(app)
          .patch(`${baseUrl}/${id}`)
          .send({ name: 'Updated Party Name' })
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(404);
      } catch (err) {
        console.log(err);
      }
    });
    it('should respond update the party with the new name', async () => {
      const id = 1;
      try {
        const res = await chai.request(app)
          .patch(`${baseUrl}/${id}`)
          .send({ name: 'Updated Party Name' })
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(200);
      } catch (err) {
        console.log(err);
      }
    });
  });
  describe('DELETE REQUEST', () => {
    it('should respond with status code 404 if the party to be deleted does not exist', async () => {
      const id = 9;
      try {
        const res = await chai.request(app)
          .delete(`${baseUrl}/${id}`)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(404);
      } catch (err) {
        console.log(err);
      }
    });
    it('it should delete the party if it exists', async () => {
      const id = 2;
      try {
        const res = await chai.request(app)
          .delete(`${baseUrl}/${id}`)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(200);
      } catch (err) {
        console.log(err);
      }
    });
  });
});

describe('Office Endpoints', () => {
  describe('POST REQUEST', () => {
    it('Should respond with status code 400 if the name is empty', (done) => {
      const newOffice = {
        name: '',
        type: 'Office Test type',
      };
      chai.request(app)
        .post(officeBaseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office name is required');
          done();
        });
    });

    it('Should respond with status code 400 if the type is empty', (done) => {
      const newOffice = {
        name: 'Office Test name',
        type: '',
      };
      chai.request(app)
        .post(officeBaseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office type is required');
          done();
        });
    });
    it('It should create the new political office', async () => {
      const newParty = {
        name: 'Gubernatorial',
        type: 'State',
      };
      try {
        const res = await chai.request(app)
          .post(officeBaseUrl)
          .send(newParty)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(201);
        expect(res.body.data[0]).to.be.an('object');
      } catch (err) {
        console.log(err);
      }
    });
    it('It should respond with status 409 if office already exists', async () => {
      const newParty = {
        name: 'Gubernatorial',
        type: 'State',
      };
      try {
        const res = await chai.request(app)
          .post(officeBaseUrl)
          .send(newParty)
          .set('token', token)
          .set('Authorization', token);
        expect(res).to.have.status(409);
        expect(res.body.error).to.eql('The office already exists');
      } catch (err) {
        console.log(err);
      }
    });
  });
  describe('GET REQUEST', () => {
    it('should respond with status code 400 if the officeId is not a number', (done) => {
      const id = 'dd';
      chai.request(app)
        .get(`${officeBaseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The office ID must be an integer');
          done();
        });
    });
    it('should respond with status code 404 if the office does not exist', (done) => {
      const id = 9;
      chai.request(app)
        .get(`${officeBaseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Office with ID: ${id} Not Found`);
          done();
        });
    });
    it('should respond with status code 400 if the officeId is null', (done) => {
      const id = null;
      chai.request(app)
        .get(`${officeBaseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('should get the political office for a valid officeId', (done) => {
      const id = 1;
      chai.request(app)
        .get(`${officeBaseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
    it('should get all political offices', (done) => {
      chai.request(app)
        .get(officeBaseUrl)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

describe('Admin Functions', () => {
  const should = 'should respond with status code ';
  it(`${should} 400 if the office Id is empty`, (done) => {
    chai.request(app)
      .post('/api/v1/office/1/register')
      .send({ office: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors[0]).to.eql('The aspirant\'s office is required');
        done();
      });
  });
  it(`${should} 400 if the office Id is not a number`, (done) => {
    chai.request(app)
      .post('/api/v1/office/1/register')
      .send({ office: 'd' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors[0]).to.eql('The office must be a number');
        done();
      });
  });
  it(`${should} 400 if the office does not exist`, (done) => {
    chai.request(app)
      .post('/api/v1/office/1/register')
      .send({ office: 3 })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.eql('The office does not exist');
        done();
      });
  });
  it(`${should} 400 if the user Id is not a number`, (done) => {
    chai.request(app)
      .post('/api/v1/office/d/register')
      .send({ office: 1 })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.errors[0]).to.eql('The user ID must be an integer');
        done();
      });
  });

  it(`${should} 404 if the user does not exist`, (done) => {
    chai.request(app)
      .post('/api/v1/office/10/register')
      .send({ office: 1 })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.eql('The user does not exist');
        done();
      });
  });
  it(`${should} 401 if user is not an admin`, (done) => {
    chai.request(app)
      .post('/api/v1/office/1/register')
      .send({ office: 1 })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
  it('should register the candidate', (done) => {
    chai.request(app)
      .post('/api/v1/office/1/register')
      .send({ office: 1, party: 1 })
      .set('token', token)
      .set('Authorization', token)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it('should get all candidates', async () => {
    try {
      const res = await chai.request(app)
        .get('/api/v1/candidates');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    } catch (err) { console.log(err); }
  });
  it('should get all for a specific office candidates', async () => {
    try {
      const res = await chai.request(app)
        .get('/api/v1/office/1/candidates');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.an('array');
    } catch (err) { console.log(err); }
  });
});
describe('Vote', () => {
  const voteUrl = '/api/v1/vote';
  it('should respond with status code 401 if token is not provided', (done) => {
    chai.request(app)
      .post(voteUrl)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.error).to.eql('You must log in to vote');
        done();
      });
  });
  it('should respond with status code 401 if token is invalid', (done) => {
    try {
      chai.request(app)
        .post(voteUrl)
        .send({})
        .set('token', 'sjksklxjakljljal')
        .set('Authorization', 'sjksklxjakljljal')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.error).to.eql('Invalid Authorization token');
          done();
        });
    } catch (err) {
      expect(err).to.have.status(401);
    }
  });
  it('should respond with status code 400 office is empty', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: '' })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.eql('The aspirant\'s office is required');
    } catch (err) { console.log(err); }
  });
  it('should respond with 400 if the office id is not a number', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 'd', candidate: 1 })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.eql('The office must be a number');
    } catch (err) { console.log(err); }
  });
  it('should respond with status code 400 candidate is empty', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 1, candidate: '' })
        .set('token', token)
        .set('Authorization', token);
      expect(res.body.errors[0]).to.eql('Select the candiadte to vote for');
    } catch (err) { console.log(err); }
  });
  it('should respond with 400 if the candidate id is not a number', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 1, candidate: 'd' })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(400);
      expect(res.body.errors[0]).to.eql('The candidate ID must be a number');
    } catch (err) { console.log(err); }
  });
  it('should ensure that candidate exists', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 1, candidate: 4 })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(404);
      expect(res.body.error).to.eql('The candidate does not exist');
    } catch (err) { console.log(err); }
  });
  it('should store the vote', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 1, candidate: 2 })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(201);
      expect(res.body.data.message).to.eql('congratulations!!!, you have successfully voted');
    } catch (err) { console.log(err); }
  });
  it('should ensure voter only votes once for an office', async () => {
    try {
      const res = await chai.request(app)
        .post(voteUrl)
        .send({ office: 1, candidate: 2 })
        .set('token', token)
        .set('Authorization', token);
      expect(res).to.have.status(409);
      expect(res.body.error).to.eql('you have already voted for this office');
    } catch (err) { console.log(err); }
  });
  describe('ELECTION RESULT', () => {
    it('should respond with status code 400 if officeId is not a number', async () => {
      try {
        const res = await chai.request(app)
          .get('/api/v1/office/d/result');
        expect(res).to.have.status(400);
        expect(res.body.error).to.eql('The office ID must be a number');
      } catch (err) { console.log(err); }
    });
    it('should get the election result for a given office', async () => {
      try {
        const res = await chai.request(app)
          .get('/api/v1/office/1/result');
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
      } catch (err) { console.log(err); }
    });
  });
});
