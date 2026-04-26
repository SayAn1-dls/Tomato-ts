import express from 'express';
import { addFood, listFood, updateFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import adminAuth from '../middleware/adminAuth.js';

const foodRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
});

foodRouter.get("/list", listFood);
foodRouter.post("/add", adminAuth, upload.single('image'), addFood);
foodRouter.put("/update", adminAuth, upload.single('image'), updateFood);
foodRouter.post("/remove", adminAuth, removeFood);

export default foodRouter;
