import express from 'express';
import userRoutes from './users.js';
import productRoutes from './products.js';
import authRoutes from './auth.js';

const router = express.Router();

// Home route - redirect to dashboard if logged in, otherwise to login
router.get('/', (req, res) => {
	if (req.session.isLoggedIn) {
		res.render('home', { 
			title: 'Dashboard',
			message: 'Welcome to the application dashboard!'
		});
	} else {
		res.redirect('/login');
	}
});

// Auth middleware for protected routes
const requireAuth = (req, res, next) => {
	if (!req.session.isLoggedIn) {
		return res.redirect('/login');
	}
	next();
};

// Admin middleware for admin-only routes
const requireAdmin = (req, res, next) => {
	if (!req.session.isLoggedIn || !req.session.user.isAdmin) {
		return res.status(403).render('error', { 
			title: 'Access Denied',
			message: 'You do not have permission to access this page.',
			layout: req.session.isLoggedIn ? 'main' : 'auth'
		});
	}
	next();
};

// Error handler
router.use((err, req, res, next) => {
	console.error(err);
	res.status(500).render('error', {
		title: 'Error',
		message: 'An unexpected error occurred',
		layout: req.session.isLoggedIn ? 'main' : 'auth'
	});
});

// Register route groups
router.use(authRoutes);
router.use(requireAuth, userRoutes);
router.use(requireAuth, productRoutes);

export default router;