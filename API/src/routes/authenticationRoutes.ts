import { Router } from "express";
import { googleLogin, logout, refreshToken } from "../controllers/authenticationController";

const router = Router();

router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
