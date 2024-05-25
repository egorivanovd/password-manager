const { Router } = require('express');
const router = new Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, noteController.getAll);
router.post('/', authMiddleware, noteController.create);
router.get('/:id', authMiddleware, noteController.getOne);
router.put('/:id', authMiddleware, noteController.update);
router.delete('/:id', authMiddleware, noteController.delete);

module.exports = router;
