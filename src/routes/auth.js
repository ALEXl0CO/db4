import express from 'express';
import prisma from '../db.js';
import { verifyUser } from '../services/auth.js';

const router = express.Router();

// Login form
router.get('/login', (req, res) => {
	// If already logged in, redirect to home
	if (req.session.isLoggedIn) {
		return res.redirect('/');
	}
	
	res.render('auth/login', { 
		title: 'Login',
		error: req.query.error,
		layout: 'auth' // Use the auth layout
	});
});

// Process login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.redirect('/login?error=Please provide email and password');
		}

		const user = await verifyUser(email, password);

		if (!user) {
			return res.redirect('/login?error=Invalid email or password');
		}

		// Set user in session
		req.session.user = user;
		req.session.isLoggedIn = true;

		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.redirect('/login?error=An error occurred');
	}
});

// Logout
router.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login');
});

export default router;
