import express from 'express';
import userRoutes from './users.js';
import productRoutes from './products.js';

const router = express.Router();

// Home route
router.get('/', (req, res) => {
	res.render('home', { 
		title: 'Home Page',
		message: 'Welcome to our application!'
	});
});

// Register route groups
router.use(userRoutes);
router.use(productRoutes);

export default router;