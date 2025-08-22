import { Router } from "express";
import {
    getChecklists,
    getChecklistById,
    createChecklist,
    deleteChecklist,
    updateChecklist,
} from "../controllers/checklistController";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/", authorize, getChecklists);
router.get("/:id", authorize, getChecklistById);
router.post("/", authorize, createChecklist);
router.put("/edit/:id", authorize, updateChecklist);
router.delete("/delete/:id", authorize, deleteChecklist);

export default router;
