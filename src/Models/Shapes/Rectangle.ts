import { Coordinate, Edge } from '../../Interfaces';
import AdjacencyType from '../../Enums/Types/AdjacencyType';
import Paralellogram from './Interfaces/Paralellogram';
import { ArrayUtils } from '../../Utils';

export default class Rectangle implements Paralellogram {
  readonly left: Edge;

  readonly right: Edge;

  constructor(origin: Coordinate, width: number, height: number) {
    if (typeof origin.x !== 'number'
      || typeof origin.y !== 'number'
      || typeof width !== 'number'
      || typeof height !== 'number'
    ) {
      throw new Error('Cannot instantiate Rectangle. Origin coordinates, width, and height must be numeric values.');
    }

    this.left = {
      upper: { x: origin.x, y: origin.y + height },
      lower: { x: origin.x, y: origin.y },
    };
    this.right = {
      upper: { x: origin.x + width, y: origin.y + height },
      lower: { x: origin.x + width, y: origin.y },
    };
  }

  /**
   * Check if the current rectangle intersects with the other rectangle.
   *
   * @param rectangle Rectangle to check if it intersects with the current one.
   * @returns Intersection area as a Rectangle or 'null' if the rectangles don't intersect.
   */
  public doesIntersectWith = (rectangle: Rectangle): Rectangle | null => {
    // Determine if the rectangles intersect
    if ((Math.min(this.right.lower.x, rectangle.right.lower.x)
      - Math.max(this.left.lower.x, rectangle.left.lower.x) <= 0)
      || (Math.min(this.left.upper.y, rectangle.left.upper.y)
      - Math.max(this.left.lower.y, rectangle.left.lower.y) <= 0)) {
      return null;
    }

    // Sort the Xs and Ys, and the middle two values are the points of interseciton.
    const sortedCoordinates: number[][] = this.sortCoordinates(rectangle);
    const X = sortedCoordinates[0];
    const Y = sortedCoordinates[1];

    return new Rectangle(
      { x: X[1], y: Y[1] },
      X[2] - X[1],
      Y[2] - Y[1],
    );
  };

  /**
   * Check if the current rectangle contains the other rectangle. If both rectangles are
   * of the same dimensions, then it will return a 'true'.
   *
   * @param rectangle Rectangle to check if it is contained within the current one.
   * @returns 'true' if it does, otherwise returns 'false'.
   */
  public doesContain = (rectangle: Rectangle): boolean => {
    if (rectangle.left.lower.x >= this.left.lower.x
      && rectangle.right.lower.x <= this.right.lower.x
      && rectangle.left.upper.y <= this.left.upper.y
      && rectangle.left.lower.y >= this.left.lower.y) {
      return true;
    }

    return false;
  };

  /**
   * Check if the current rectangle is adjacent to the other. Adjacency is defined as
   * sharing at least one point.
   *
   * @param rectangle Rectangle to check if it is adjacent to the current one.
   * @returns The AdjacencyType or null if the rectangle isn't adjacent.
   */
  public isAdjacentTo = (rectangle: Rectangle): AdjacencyType => {
    // Check for intersection and containment.
    if (this.doesContain(rectangle) || this.doesIntersectWith(rectangle) !== null) {
      return AdjacencyType.NotAdjacent;
    }

    // Check for duplicates in the coordinates, which will suggest a possible adjacent side.
    const sortedCoordinates: number[][] = this.sortCoordinates(rectangle);
    const duplicateXs: number[] = ArrayUtils.default.findDuplicates<number>(sortedCoordinates[0]);
    const duplicateYs: number[] = ArrayUtils.default.findDuplicates<number>(sortedCoordinates[1]);

    // If there are no duplicates
    if (duplicateXs.length === 0 && duplicateYs.length === 0) return AdjacencyType.NotAdjacent;

    // There is at least one X point common
    if (duplicateXs.length > 0) {
      // If all the Xs match, check the Ys. Case: One on top of the other.
      if (duplicateXs.length === 2) {
        if (duplicateYs.length === 1) return AdjacencyType.Proper;
        return AdjacencyType.NotAdjacent;
      }

      // Case: One side is properly adjacent.
      if (duplicateYs.length === 2) return AdjacencyType.Proper;

      // Case: One side is sub-line adjacent.
      if (rectangle.left.upper.y <= this.left.upper.y
        && rectangle.left.lower.y >= this.left.lower.y) {
        return AdjacencyType.SubLine;
      }

      // Case: Partially adjacent. Trivial case, if no other conditions matched.
      return AdjacencyType.Partial;
    }

    // Implicit: there is at least one Y point common

    // Case: Rectangle above/below is sub-line adjacent at the top/bottom. Hence, no common Xs.
    if (rectangle.left.lower.x > this.left.upper.x
      && rectangle.right.lower.x < this.right.upper.x) {
      return AdjacencyType.SubLine;
    }

    // Case: Rectangle above/below is partial from the left or right. Hence, no common Xs.
    return AdjacencyType.Partial;
  };

  /**
   * Helper method to sort all of the Xs and Ys coordinates with the current rectangle.
   *
   * @param rectangle Rectangle whose coordinates have to be sorted with.
   * @returns Array of number[] where the first index is for 'x' and the other for 'y'.
   */
  private sortCoordinates = (rectangle: Rectangle): number[][] => {
    const xs: number[] = [
      this.left.lower.x,
      this.right.lower.x,
      rectangle.left.lower.x,
      rectangle.right.lower.x,
    ];
    const ys: number[] = [
      this.left.lower.y,
      this.left.upper.y,
      rectangle.left.lower.y,
      rectangle.left.upper.y,
    ];

    return [xs.sort(), ys.sort()];
  };
}
