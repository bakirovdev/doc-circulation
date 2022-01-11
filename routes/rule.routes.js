const express = require('express')
const RuleController = require('../controllers/RuleController')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/get_user_rule', auth, RuleController.getUserRule)
router.get('/get_all_rule', auth, RuleController.getAllRule)
router.post('/attach_rule', auth, RuleController.attachRule)
router.post('/un_attach_rule', auth, RuleController.unAttachRule)
module.exports = router