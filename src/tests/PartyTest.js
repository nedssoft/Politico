import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../../app';

chai.use(chaiHTTP);
const { expect } = chai;

describe('Test Party Endpoints', () => {
  it('Should ensure that party name is not empty', (done) => {
    const newParty = {
      name: '',
      hqAddress: 'Test Address',
      logoUrl: 'TestLogo Url',
    };
    chai.request(app)
      .post('/api/v1/parties')
      .send(newParty)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.errors[0]).to.eql('The party name is required');
        done();
      });
  });
  it('Should ensure that party hqAddress is not empty', (done) => {
    const newParty = {
      name: 'Test Party',
      hqAddress: '',
      logoUrl: 'TestLogo Url',
    };
    chai.request(app)
      .post('/api/v1/parties')
      .send(newParty)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.errors[0]).to.eql('The party Address is required');
        done();
      });
  });
  it('Should ensure that party logoUrl is not empty', (done) => {
    const newParty = {
      name: 'Test Party',
      hqAddress: 'Test Address',
      logoUrl: '',
    };
    chai.request(app)
      .post('/api/v1/parties')
      .send(newParty)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.errors[0]).to.eql('The party logo is required');
        done();
      });
  });
  it('It should create new Party', (done) => {
    const newParty = {
      name: 'Test Party',
      hqAddress: 'Test Address',
      logoUrl: 'TestLogo Url',
    };
    chai.request(app)
      .post('/api/v1/parties')
      .send(newParty)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
  it('Should ensure that party does not already exist in the database', (done) => {
    const newParty = {
      name: 'Test Party',
      hqAddress: 'Test Address',
      logoUrl: 'TestLogo Url',
    };
    chai.request(app)
      .post('/api/v1/parties')
      .send(newParty)
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });
  });
  it('Should return Not found if the Party with the ID does not exist', (done) => {
    const id = 2;
    chai.request(app)
      .get(`/api/v1/parties/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.error).to.eql('Not Found');
        done();
      });
  });
  it('Should return status 200 if the record exists', (done) => {
    const id = 1;
    chai.request(app)
      .get(`/api/v1/parties/${id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
