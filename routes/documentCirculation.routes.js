const express = require('express')
const DocumentTypeController = require('../controllers/DocumentTypeController')
const DocumentController = require('../controllers/DocumentController')
const DocumentChatController = require('../controllers/DocumentChatController')
const AuthController = require('../controllers/AuthController')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/', DocumentController.create)
router.get('/sent', DocumentController.sentDocument)
router.get('/received', DocumentController.receivedDocument)
router.get('/:id', DocumentController.show)
router.get('/chat/:id', DocumentChatController.index)
router.post('/chat', DocumentChatController.create)
router.put('/answer/:id', DocumentController.answer)




module.exports = router