const { Router } = require('express');
const router = new Router();
const passwordController = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, passwordController.getAll);
router.post('/', authMiddleware, passwordController.create);
router.get('/:id', authMiddleware, passwordController.getOne);
router.put('/:id', authMiddleware, passwordController.update);
router.delete('/:id', authMiddleware, passwordController.delete);

module.exports = router;
