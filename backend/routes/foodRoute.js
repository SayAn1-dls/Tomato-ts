import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
const foodRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024
    }
})

foodRouter.get("/list",listFood);
foodRouter.post("/add",upload.single('image'),addFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;
