const express = require('express')
const UserController = require('../controllers/UserController')
const AuthController = require('../controllers/AuthController')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/', auth,UserController.create)
router.post('/login', AuthController.login)
router.get('/', auth, UserController.index)
router.put('/:id',  auth, UserController.update)
router.delete('/:id', auth,UserController.delete)
router.put('/update_active/:id', auth,UserController.updateActive)
router.get('/auth_user', auth,UserController.user)

module.exports = router