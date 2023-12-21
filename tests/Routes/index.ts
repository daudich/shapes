import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../src/App';

chai.use(chaiHttp);
chai.should();

describe('Shapes API Router', () => {
  let app: App;
  let API: ChaiHttp.Agent;

  beforeEach(() => {
    app = new App();
    app.start();
    API = chai.request(app.server);
  });
  
  after(() => app.server!.close());

  it('should be running', (done: Mocha.Done) => {
    API.get('/api/v1/').end((err, res) => {
      res.status.should.eql(200);
      res.text.should.equal('Shapes API version 1');
      done();
    });
  });

  it('should throw a method not allowed 405 on illegal method calls ', (done: Mocha.Done) => {
    API.post('/api/v1/').end((err, res) => {
      res.status.should.eql(405);
      res.text.should.equal('Method Not Allowed');
      done();
    });
  });

  it('should throw a 404 for unrecongized endpoint calls ', (done: Mocha.Done) => {
    API.post('/api/v2/').end((err, res) => {
      res.status.should.eql(404);
      res.text.should.equal('Not Found');
      done();
    });
  });
});