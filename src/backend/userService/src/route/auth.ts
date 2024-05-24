import { Router } from "express";
import {
  changeSubscription,
  login,
  logout,
  signup,
  whoIsMe,
} from "../controller/auth";
import { logRequests } from "../middleware/request";
import rateLimit from "express-rate-limit";
import { authenticate } from "../middleware/authenticate";
import {
  changeSubscriptionValidation,
  isUserExist,
  signinValidation,
  signupValidation,
} from "../validation/user";
import APP_CONFIG from "../config/app.config";

const router = Router();

const limiter = rateLimit({
  windowMs: APP_CONFIG.RATE_LIMIT.API.WINDOW,
  max: APP_CONFIG.RATE_LIMIT.API.MAX_REQUESTS,
  message: APP_CONFIG.RATE_LIMIT.API.MESSAGE,
});

router.use(logRequests);
router.use(limiter);

router.post("/subscribe", signupValidation, signup);
router.post("/login", signinValidation, isUserExist, login);
router.post("/logout", authenticate, logout);

router.post("/whoisme", authenticate, isUserExist, whoIsMe); // Becareful about limiting this
router.put(
  "/change",
  authenticate,
  changeSubscriptionValidation,
  isUserExist,
  changeSubscription
);

export default router;
