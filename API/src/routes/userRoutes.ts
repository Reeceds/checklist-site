import { Router } from "express";
import { authorize } from "../middleware/authorize";
import { getCurrentUser } from "../controllers/userController";

const router = Router();

router.get("/", authorize, getCurrentUser);

export default router;
