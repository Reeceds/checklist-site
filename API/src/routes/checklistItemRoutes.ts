import { Router } from "express";
import { modifyChecklistItem } from "../controllers/checklistItemController";

const router = Router();

router.post("/:id", modifyChecklistItem);

export default router;
