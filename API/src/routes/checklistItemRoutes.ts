import { Router } from "express";
import { modifyChecklistItem } from "../controllers/checklistItemController";
import { authorize } from "../middleware/authorize";

const router = Router();

router.post("/:id", authorize, modifyChecklistItem);

export default router;
