import express from "express";
import { signIn, signUp } from "../controllers/participant.controller.js";
import verifySignInMiddleware from "../middlewares/validationSignIn.middleware.js";
import verifySignUpMiddleware from "../middlewares/validationSignUp.middleware.js";

const router = express.Router();

router.post("/signUp", verifySignUpMiddleware, signUp);
router.post("/signIn", verifySignInMiddleware, signIn);

export default router;
