const express = require('express');

const credcontroller = require('../controller/todo_controller');
const authenticateToken = require('../middleware/authmiddle');

const router = express.Router();

router.use('/', authenticateToken);
router.post('/create', credcontroller.Create);
router.get('/read', credcontroller.Read);
router.put('/update/:work_id', credcontroller.Update);
router.delete('/delete/:work_id', credcontroller.Delete);

module.exports = router;