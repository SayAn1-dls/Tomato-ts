import express from 'express';
import { adminLogin, adminStats, listUsers } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/stats', adminAuth, adminStats);
adminRouter.get('/users', adminAuth, listUsers);

export default adminRouter;
