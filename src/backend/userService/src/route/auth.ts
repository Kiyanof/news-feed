import {Router} from 'express'
import { inputValidation as signupInputValidation, isUserExist } from '../middleware/signup'
import { changeSubscription, login, logout, signup, whoIsMe } from '../controller/auth'
import { logRequests } from '../middleware/request'
import rateLimit from 'express-rate-limit';
import { authenticate } from '../middleware/authenticate';

const router = Router()

// Define rate limit rule
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
  });

router.use(logRequests)
router.use(limiter)

router.post('/subscribe', signupInputValidation, isUserExist, signup)
router.post('/login', login)
router.post('/logout', authenticate, logout)

router.post('/whoisme',authenticate, whoIsMe) // Becareful about limiting this 
router.put('/change', authenticate, changeSubscription)

export default router