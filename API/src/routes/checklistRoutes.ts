import { Router } from "express";
import {
    getChecklists,
    getChecklistById,
    createChecklist,
    deleteChecklist,
    updateChecklist,
} from "../controllers/checklistController";

const router = Router();

router.get("/", getChecklists);
router.get("/:id", getChecklistById);
router.post("/", createChecklist);
router.put("/edit/:id", updateChecklist);
router.delete("/delete/:id", deleteChecklist);

export default router;
