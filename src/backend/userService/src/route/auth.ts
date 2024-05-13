import {Router} from 'express'
import { inputValidation as signupInputValidation, isUserExist } from '../middleware/signup'
import { login, logout, signup, whoIsMe } from '../controller/auth'
import { logRequests } from '../middleware/request'

const router = Router()

router.use(logRequests)

router.post('/subscribe', signupInputValidation, isUserExist, signup)
router.post('/whoisme', whoIsMe)
router.post('/login', login)
router.post('/logout', logout)

export default router