import Router from '@koa/router';

import RectangleService from '../Services/Rectangle.service';

const router = new Router();

router.post('/intersect', RectangleService.intersect);
router.post('/contain', RectangleService.contain);
router.post('/are-adjacent', RectangleService.areAdjacent);

export default router.routes();
