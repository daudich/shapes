import { expect } from 'chai';
import AdjacencyType from '../../../src/Enums/Types/AdjacencyType';
import Rectangle from '../../../src/Models/Shapes/Rectangle';

describe('Rectangle', () => {
  describe('constructor', () => {
    it('should create the Rectangle object with correct dimensions', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);

      expect(a).to.not.be.null;
      expect(a.left.lower).to.be.deep.equal({ x: 0, y: 0 });
      expect(a.left.upper).to.be.deep.equal({ x: 0, y: 5 });
      expect(a.right.lower).to.be.deep.equal({ x: 5, y: 0 });
      expect(a.right.upper).to.be.deep.equal({ x: 5, y: 5 });
    });

    it('should throw an error if the dimensions are non-numeric', () => {
      // @ts-ignore
      expect(() => new Rectangle({ x: 'a', y: 0, }, 5, 5)).to.throw('Cannot instantiate Rectangle');
    });

    it('should throw an error if a null parameter is provided', () => {
      // @ts-ignore
      expect(() => new Rectangle({ x: 0, y: 0, }, null, 5)).to.throw('Cannot instantiate Rectangle');
    });

    it('should throw an error if not all parameters are provided', () => {
      // @ts-ignore
      expect(() => new Rectangle({ x: 0, y: 0, }, 5)).to.throw('Cannot instantiate Rectangle');
    });
  });

  describe('doesIntersectWith', () => {
    it('should return a null if two rectangles are not intersecting', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 6,
        y: 6,
      }, 5, 5);
      const test: Rectangle | null = a.doesIntersectWith(b);

      expect(test).to.be.null;
    });

    it('should return an rectangle covering the intersection area between two rectangles', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 4,
        y: 0,
      }, 5, 5);
      const test: Rectangle | null = a.doesIntersectWith(b);

      expect(test).to.not.be.null;
      expect(test!.left.lower).to.deep.equal({ x: 4, y: 0 });
      expect(test!.left.upper).to.deep.equal({ x: 4, y: 5 });
      expect(test!.right.lower).to.deep.equal({ x: 5, y: 0 });
      expect(test!.right.upper).to.deep.equal({ x: 5, y: 5 });
    });

    it('should return an area of the same size as two exactly sized overlapping rectangles', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const test: Rectangle | null = a.doesIntersectWith(b);

      expect(test).to.not.be.null;
      expect(test!.left.lower).to.deep.equal(a.left.lower);
      expect(test!.left.upper).to.deep.equal(a.left.upper);
      expect(test!.right.lower).to.deep.equal(a.right.lower);
      expect(test!.right.upper).to.deep.equal(a.right.upper);
    });

    it('should return a valid area of intersection for negative coordinates', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: -4,
        y: -4,
      }, 5, 5);
      const test: Rectangle | null = a.doesIntersectWith(b);

      expect(test).to.not.be.null;
      expect(test!.left.lower).to.deep.equal({ x: 0, y: 0 });
      expect(test!.left.upper).to.deep.equal({ x: 0, y: 1 });
      expect(test!.right.lower).to.deep.equal({ x: 1, y: 0 });
      expect(test!.right.upper).to.deep.equal({ x: 1, y: 1 });
    });

    it('should return a null in case of an adjacenct rectangle', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 5,
        y: 0,
      }, 5, 5);
      const test: Rectangle | null = a.doesIntersectWith(b);

      expect(test).to.be.null;
    });
  });

  describe('doesContain', () => {
    it('should return a false if the comparing rectangle is not inside the reference one', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 5,
        y: 0,
      }, 5, 5);

      expect(a.doesContain(b)).to.be.false;
    });

    it('should return a true if both rectangles are of the same dimensions and overlapping', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);

      expect(a.doesContain(b)).to.be.true;
    });

    it('should return a false if the rectangles intersect but not contain', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: -4,
        y: -4,
      }, 5, 5);

      expect(a.doesContain(b)).to.be.false;
    });

    it('should return a true if the comparing rectangle is contained within the reference', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 1,
        y: 1,
      }, 3, 3);

      expect(a.doesContain(b)).to.be.true;
    });
  });

  describe('isAdjacentTo', () => {
    it('should return a Not Adjacent if rectangles intersect', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.NotAdjacent);
    });

    it('should return a Not Adjacent if rectangles are contained', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 1,
        y: 1,
      }, 3, 3);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.NotAdjacent);
    });
    
    it('should return a Not Adjacent if rectangles are disjoint and non-adjacent', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 10,
        y: 10,
      }, 3, 3);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.NotAdjacent);
    });

    it('should return a Proper type if rectangles are adjacent and of same width', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 0,
        y: 5,
      }, 5, 1);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Proper);
    });

    it('should return a Not Adjacent type if rectangles are non-adjacent and of same width', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 0,
        y: 6,
      }, 5, 1);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.NotAdjacent);
    });

    it('should return a Proper type if rectangles are adjacent and of same height', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 5,
        y: 0,
      }, 1, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Proper);
    });

    it('should return a Sub-line type if rectangles are adjacent and not of same height', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: -3,
        y: 2,
      }, 3, 1);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.SubLine);
    });

    it('should return a Sub-line type if rectangles are adjacent and not of same width', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 2,
        y: 5,
      }, 2, 3);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.SubLine);
    });

    it('should return a Partial type if the rectangle is bottom adjacent on the sides', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 5,
        y: 3,
      }, 5, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Partial);
    });

    it('should return a Partial type if the rectangle is top adjacent on the sides', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: -5,
        y: -3,
      }, 5, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Partial);
    });

    it('should return a Partial type if the rectangle is left adjacent on the top/bottom', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: 3,
        y: -5,
      }, 5, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Partial);
    });

    it('should return a Partial type if the rectangle is right adjacent on the top/bottom', () => {
      const a: Rectangle = new Rectangle({
        x: 0,
        y: 0,
      }, 5, 5);
      const b: Rectangle = new Rectangle({
        x: -3,
        y: 5,
      }, 5, 5);

      expect(a.isAdjacentTo(b)).to.be.equal(AdjacencyType.Partial);
    });
  });
});