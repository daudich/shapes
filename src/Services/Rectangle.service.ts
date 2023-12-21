import Boom from '@hapi/boom';
import { Context } from 'koa';
import Rectangle from '../Models/Shapes/Rectangle';

interface IncomingRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RectangleRequest {
  r1: IncomingRectangle;
  r2: IncomingRectangle;
}

export default class RectangleService {
  public static intersect = (ctx: Context): void => {
    const data: RectangleRequest = ctx.request.body as RectangleRequest;

    try {
      const r1 = new Rectangle(
        { x: data.r1.x, y: data.r1.y },
        data.r1.width,
        data.r1.height,
      );
      const r2 = new Rectangle(
        { x: data.r2.x, y: data.r2.y },
        data.r2.width,
        data.r2.height,
      );

      ctx.body = r1.doesIntersectWith(r2);
      ctx.status = ctx.body === null ? 204 : 200;
    } catch (err) {
      const boom = Boom.badRequest('Please check your request JSON object and try again.');

      ctx.status = boom.output.statusCode;
      ctx.body = boom.output.payload;
      console.error(err);
    }
  };

  public static contain = (ctx: Context): void => {
    const data: RectangleRequest = ctx.request.body as RectangleRequest;

    try {
      const r1 = new Rectangle(
        { x: data.r1.x, y: data.r1.y },
        data.r1.width,
        data.r1.height,
      );
      const r2 = new Rectangle(
        { x: data.r2.x, y: data.r2.y },
        data.r2.width,
        data.r2.height,
      );

      ctx.body = { isContained: r1.doesContain(r2) };
      ctx.status = 200;
    } catch (err) {
      const boom = Boom.badRequest('Please check your request JSON object and try again.');

      ctx.status = boom.output.statusCode;
      ctx.body = boom.output.payload;
      console.error(err);
    }
  };

  public static areAdjacent = (ctx: Context): void => {
    const data: RectangleRequest = ctx.request.body as RectangleRequest;

    try {
      const r1 = new Rectangle(
        { x: data.r1.x, y: data.r1.y },
        data.r1.width,
        data.r1.height,
      );
      const r2 = new Rectangle(
        { x: data.r2.x, y: data.r2.y },
        data.r2.width,
        data.r2.height,
      );

      ctx.status = 200;
      ctx.body = { adjacencyType: r1.isAdjacentTo(r2) };
    } catch (err) {
      const boom = Boom.badRequest('Please check your request JSON object and try again.');

      ctx.status = boom.output.statusCode;
      ctx.body = boom.output.payload;
      console.error(err);
    }
  };
}
