import { Context } from 'koa';
import Router from '@koa/router';

import RectangleRouter from './Rectangle.router';

const router = new Router({
  prefix: '/api/v1',
});

router.get('/', (ctx: Context) => {
  ctx.status = 200;
  ctx.body = 'Shapes API version 1';
});
router.use('/rectangle', RectangleRouter);

export default router;
