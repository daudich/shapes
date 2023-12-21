import chai from 'chai';
import chaiHttp from 'chai-http';

import App from '../../src/App';
import AdjacencyType from '../../src/Enums/Types/AdjacencyType';

chai.use(chaiHttp);
chai.should();

describe('Rectangle API Router', () => {
  let app: App;
  let API: ChaiHttp.Agent;

  beforeEach(() => {
    app = new App();
    app.start();
    API = chai.request(app.server);
  });
  
  after(() => app.server!.close());

  describe('Input validation', () => {
    it('should return a 400 if the intersect request is invalid', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 6, y: 6, width: "asdfasdf", height: 5 };
      
      API.post('/api/v1/rectangle/intersect')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        done();
      });
    });

    it('should return a 400 if the contain request is bad', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 6, y: 6, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/contain')
      .set('content-type', 'application/json')
      .send({ j: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        done();
      });
    });

    it('should return a 400 if the are-adjacent request is incomplete', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 6, y: 6, height: 5 };
      
      API.post('/api/v1/rectangle/are-adjacent')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(400);
        res.type.should.eql('application/json');
        done();
      });
    });
  });

  describe('/intersect', () => {
    it('should return a 402 if the rectangles do not intersect', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 6, y: 6, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/intersect')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(204);
        done();
      });
    });

    it('should return a 200 and a rectangle if the rectangles do intersect', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: -4, y: -4, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/intersect')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({
          "left": {
            "upper": {
              "x": 0,
              "y": 1
            },
            "lower": {
              "x": 0,
              "y": 0
            }
          },
          "right": {
            "upper": {
              "x": 1,
              "y": 1
            },
            "lower": {
              "x": 1,
              "y": 0
            }
          }
        });
        done();
      });
    });
  });

  describe('/contain', () => {
    it('should return a false if the r2 is not contained in r1', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 2, y: 0, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/contain')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ isContained: false });
        done();
      });
    });

    it('should return a true if the r2 is contained in r1', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 1, y: 1, width: 2, height: 2 };
      
      API.post('/api/v1/rectangle/contain')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ isContained: true });
        done();
      });
    });
  });

  describe('/are-adjacent', () => {
    it('should return a Not Adjacent if the rectangles are not adjacent', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 100, y: -4560, width: 599999, height: 5456454 };
      
      API.post('/api/v1/rectangle/are-adjacent')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ adjacencyType: AdjacencyType.NotAdjacent });
        done();
      });
    });

    it('should return Proper adjacency type if the rectangles are adjacent', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 0, y: -5, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/are-adjacent')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ adjacencyType: AdjacencyType.Proper });
        done();
      });
    });

    it('should return Partial adjacency type for paritally adjacent rectangles', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: -5, y: 3, width: 5, height: 5 };
      
      API.post('/api/v1/rectangle/are-adjacent')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ adjacencyType: AdjacencyType.Partial });
        done();
      });
    });

    it('should return Sub-line adjacency type sub-line rectangles', (done: Mocha.Done) => {
      const a = { x: 0, y: 0, width: 5, height: 5 };
      const b = { x: 2, y: 5, width: 2, height: 2 };
      
      API.post('/api/v1/rectangle/are-adjacent')
      .set('content-type', 'application/json')
      .send({ r1: a, r2: b })
      .end((err, res) => {
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.eql({ adjacencyType: AdjacencyType.SubLine });
        done();
      });
    });
  });
});