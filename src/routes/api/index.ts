import { Router } from 'express';
import userRoutes from './userRoutes'; // Import user routes
import thoughtRoutes from './thoughtRoutes'; // Import thought routes

const router = Router();

// Use the user and thought routes directly
router.use('/api/users', userRoutes);
router.use('/api/thoughts', thoughtRoutes);


export default router;
