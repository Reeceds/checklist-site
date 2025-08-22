import { Router } from "express";
import { getGoogleClientId } from "../controllers/configController";

const router = Router();

router.get("/google-client-id", getGoogleClientId);

export default router;
