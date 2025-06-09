import { Router } from 'express';
import userRoutes from './api/userRoutes.js'; // Import user routes
import thoughtRoutes from './api/thoughtRoutes.js'; // Import thought routes

const router = Router();

// Use the user and thought routes directly
router.use('/api/users', userRoutes);
router.use('/api/thoughts', thoughtRoutes);


export default router;
