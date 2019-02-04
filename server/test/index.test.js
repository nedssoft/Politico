import chai from 'chai';
import chaiHTTP from 'chai-http';
import app from '../app';
import Authenticator from '../helpers/Authenticator';

chai.use(chaiHTTP);
const { expect } = chai;
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
  let token;
  const payload = { id: 1, isAdmin: true };
  it('should generate token', (done) => {
    token = generateToken(payload);
    expect(token).to.be.a('string');
    expect(token).to.be.have.lengthOf.above(32);
    done();
  });
  it('should verify  token', (done) => {
    const verifiedToken = verifyToken(token);
    expect(verifiedToken.id).to.eql(1);
    expect(verifiedToken.isAdmin).to.equal(true);
    done();
  });
});
