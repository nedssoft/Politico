import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';

chai.use(chaiHTTP);
const { expect } = chai;
const baseUrl = '/api/v1/parties';

describe('Test Party Endpoints', () => {
  /* eslint-disable no-unused-expressions */
  describe('POST REQUESTS', () => {
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
    it('It should create the new political party', (done) => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newParty)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.message).to.eql('Ok');
          expect(res.body.data[0].name).to.eql(newParty.name);
          expect(res.body.data[0].hqAddress).to.eql(newParty.hqAddress);
          expect(res.body.data[0].logoUrl).to.eql(newParty.logoUrl);
          done();
        });
    });
    it('It should ensure that party does not already exist in the database', (done) => {
      const newParty = {
        name: 'Test Party',
        hqAddress: 'Test Address',
        logoUrl: 'test-logo.png',
      };
      chai.request(app)
        .post(baseUrl)
        .send(newParty)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.error).to.eql('The party already exists');
          done();
        });
    });
  });
  describe('GET REQUESTS', () => {
    it('It should return Not found if the Party with the ID does not exist', (done) => {
      const id = 2;
      chai.request(app)
        .get(`${baseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Party with ID: ${id} Not Found`);
          done();
        });
    });
    it('It should return the party record if it exists', (done) => {
      const id = 1;
      chai.request(app)
        .get(`${baseUrl}/${id}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.name).to.eql('Test Party');
          expect(res.body.data.hqAddress).to.eql('Test Address');
          expect(res.body.data.logoUrl).to.eql('test-logo.png');
          done();
        });
    });
    it('It should return the array of all political parties', (done) => {
      chai.request(app)
        .get(baseUrl)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.lengthOf(1);
          expect(res.body.data[0].name).to.eql('Test Party');
          expect(res.body.data[0].hqAddress).to.eql('Test Address');
          expect(res.body.data[0].logoUrl).to.eql('test-logo.png');
          done();
        });
    });
  });
  describe('PATCH REQUESTS', () => {
    it('It should return throw Not Found if the party does not exist', (done) => {
      const id = 2;
      const newName = {
        name: 'New Test Party',
      };
      chai.request(app)
        .patch(`${baseUrl}/${id}`)
        .send(newName)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql('The party you want to edit does not exist');
          done();
        });
    });
    it('It should ensure that the new party name is not empty', (done) => {
      const id = 1;
      const newName = {
        name: '',
      };
      chai.request(app)
        .patch(`${baseUrl}/${id}`)
        .send(newName)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.errors[0]).to.eql('The new party name is required');
          done();
        });
    });
    it('Should it should update the political party with the new name', (done) => {
      const id = 1;
      const newName = {
        name: 'New Test Party',
      };
      chai.request(app)
        .patch(`${baseUrl}/${id}`)
        .send(newName)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data.name).to.eql('New Test Party');
          expect(res.body.data.id).to.eql(id);
        });
      done();
    });
  });
  describe('DELETE REQUESTS', () => {
    it('It should throw Not Found if the political party does not exist', (done) => {
      const partyId = 2;
      chai.request(app)
        .delete(`${baseUrl}/${partyId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.eql(`Party with ID: ${partyId} Not Found`);
          done();
        });
    });
    it('It should delete the political party', (done) => {
      const partyId = 1;
      chai.request(app)
        .delete(`${baseUrl}/${partyId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data[0].message).to.eql('success');
          done();
        });
    });
    it('It should return 400 if the URL is incorrect', (done) => {
      chai.request(app)
        .delete(`${baseUrl}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
