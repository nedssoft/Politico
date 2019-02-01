import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/offices';

describe('Test All Office Endpoints', () => {
  /* eslint-disable no-unused-expressions */

  describe('POST REQUEST', () => {
    it('It should throw an error if the office name is empty', (done) => {
      const newOffice = {
        name: '',
        type: 'Test Office Type',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office name is required');
          done();
        });
    });
    it('It should throw an error if the office name is whitespace', (done) => {
      const newOffice = {
        name: '   ',
        type: 'Test Office Type',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office name is required');
          done();
        });
    });

    it('It should throw an error if the office type is empty', (done) => {
      const newOffice = {
        name: 'Test Office Name',
        type: '',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office type is required');
          done();
        });
    });
    it('It should throw an error if the office type is whitespace', (done) => {
      const newOffice = {
        name: 'Test Office Name',
        type: '   ',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The political office type is required');
          done();
        });
    });
    it('It should create the new political office', (done) => {
      const newOffice = {
        name: 'Test Office Name',
        type: 'Test Office Type',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.data[0].name).to.eql(newOffice.name);
          expect(res.body.data[0].type).to.eql(newOffice.type);
          expect(res.body.data[0].id).to.equal(1);
          done();
        });
    });
    it('It should create the new political office', (done) => {
      const newOffice = {
        name: 'Test Office Name',
        type: 'Test Office Type',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newOffice)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.error).to.eql('The political office already exists');
          done();
        });
    });
  });
  describe('GET REQUEST', () => {
    it('It should throw error if the office does not exists', (done) => {
      const officeId = 2;
      chai.request(app)
        .get(`${baseUrl}/${officeId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql('Office Not Found');
          done();
        });
    });
    it('It should return the office with the given officeId', (done) => {
      const officeId = 1;
      chai.request(app)
        .get(`${baseUrl}/${officeId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data[0].name).to.eql('Test Office Name');
          expect(res.body.data[0].type).to.eql('Test Office Type');
          done();
        });
    });
    it('It should return the list of political offices', (done) => {
      chai.request(app)
        .get(baseUrl)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.lengthOf(1);
          expect(res.body.data[0].name).to.eql('Test Office Name');
          expect(res.body.data[0].type).to.eql('Test Office Type');
          done();
        });
    });
  });
});
