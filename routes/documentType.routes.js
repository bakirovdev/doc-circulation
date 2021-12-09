const express = require('express')
const DocumentTypeController = require('../controllers/DocumentTypeController')
const AuthController = require('../controllers/AuthController')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/', DocumentTypeController.create)
router.get('/',  DocumentTypeController.index)
router.get('/active',  DocumentTypeController.getActive)
router.delete('/:id',  DocumentTypeController.destroy)
router.put('/:id',  DocumentTypeController.update)


module.exports = router