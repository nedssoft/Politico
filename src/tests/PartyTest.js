import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../../app';

chai.use(chaiHTTP);
const { expect } = chai;

describe('Test Party Endpoints', () => {
  it('It should create new Party without duplicate', (done) => {
    const newParty = {
      id: 1,
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
});
