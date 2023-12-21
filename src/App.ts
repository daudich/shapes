import Koa from 'koa';
import KoaBody from 'koa-body';
import KoaHelmet from 'koa-helmet';
import Boom from '@hapi/boom';
import { Server } from 'node:http';

import router from './Routes';

export default class ShapesApp {
  private port = 3000;

  private app: Koa;

  private httpServer: Server | null;

  constructor(port?: number) {
    if (port !== undefined) this.port = port;
    this.app = new Koa();
    this.httpServer = null;
  }

  public get server() : Server | null {
    return this.httpServer;
  }

  public start(): void {
    this.app.use(KoaHelmet());
    this.app.use(KoaBody());
    this.app.use(router.routes());
    this.app.use(router.allowedMethods({
      notImplemented: () => Boom.notImplemented,
      methodNotAllowed: () => Boom.methodNotAllowed,
    }));

    console.log(`Server is running on port ${this.port}`);

    this.httpServer = this.app.listen(this.port);
  }
}
