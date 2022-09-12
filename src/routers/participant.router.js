import express from "express";
import {
    endSession,
    signIn,
    signUp,
} from "../controllers/participant.controller.js";
import verifySignInMiddleware from "../middlewares/validationSignIn.middleware.js";
import verifySignUpMiddleware from "../middlewares/validationSignUp.middleware.js";
import authorizationMiddleware from "../middlewares/authorization.middleware.js";
const router = express.Router();

router.post("/signUp", verifySignUpMiddleware, signUp);
router.post("/signIn", verifySignInMiddleware, signIn);
router.delete("/logout", authorizationMiddleware, endSession);

export default router;
