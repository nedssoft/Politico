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
        expect(res).to.have.status(404);
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
        expect(res.body.data.name).to.eql('Test Party');
        expect(res.body.data.hqAddress).to.eql('Test Address');
        expect(res.body.data.logoUrl).to.eql('TestLogo Url');
        done();
      });
  });
  it('Should it should return Not Found if the party does not exist', (done) => {
    const id = 2;
    chai.request(app)
      .patch(`/api/v1/parties/${id}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.error).to.eql('The party you want to edit does not exist');
        done();
      });
  });
  it('Should it should check that the new political party name exists', (done) => {
    const id = 1;
    const newName = {
      name: '',
    };
    chai.request(app)
      .patch(`/api/v1/parties/${id}`)
      .send(newName)
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.error).to.eql('Specify the new party name');
        done();
      });
  });
  it('Should it should update the political party with the new name', (done) => {
    const id = 1;
    const newName = {
      name: 'New Test Party',
    };
    chai.request(app)
      .patch(`/api/v1/parties/${id}`)
      .send(newName)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.name).to.eql(newName.name);
        expect(res.body.data.id).to.eql(id);
        done();
      });
  });
});
