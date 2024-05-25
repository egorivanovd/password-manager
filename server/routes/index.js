const { Router } = require('express');
const router = new Router();
const userRouter = require('../routes/userRouter');
const passwordRouter = require('../routes/passwordRouter');
const noteRouter = require('../routes/noteRouter');

router.use('/user', userRouter);
router.use('/password', passwordRouter);
router.use('/note', noteRouter);

module.exports = router;
