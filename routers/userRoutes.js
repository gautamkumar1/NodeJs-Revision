import express from 'express';
import { getAllUsers, login, register } from '../controllers/userController.js';
const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/getuserdata',getAllUsers)

export default router;