const router = require('express').Router()
const userController = require('../controllers/user.controller')
const auth = require('../middlewares/user.middleware')

//User Routes
router.post('/', userController.userRegister)
router.post('/verifyotp', userController.verifyOTP)
router.post('/regenarteotp', userController.regenerateOTP)
router.post('/login', userController.login)
router.get('/', auth, userController.userByID)


module.exports = router