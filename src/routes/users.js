import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Admin middleware for user management
const requireAdmin = (req, res, next) => {
	if (!req.session.user.isAdmin) {
		return res.status(403).render('error', { 
			title: 'Access Denied',
			message: 'You do not have permission to access this page.' 
		});
	}
	next();
};

// List all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				name: true,
				isAdmin: true
			}
		});
		res.render('users/index', { 
			title: 'Users',
			users 
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching users');
	}
});

// Show form to create a new user (admin only)
router.get('/users/new', requireAdmin, (req, res) => {
	res.render('users/new', { 
		title: 'Create New User',
		error: req.query.error
	});
});

// Process new user creation (admin only)
router.post('/users', requireAdmin, async (req, res) => {
	try {
		const { email, name, password, isAdmin } = req.body;

		if (!email || !name || !password) {
			return res.redirect('/users/new?error=Please fill all required fields');
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return res.redirect('/users/new?error=Email already in use');
		}

		// Hash password and create user
		const hashedPassword = await Bun.password.hash(password);

		await prisma.user.create({
			data: {
			email,
			name,
			password: hashedPassword,
			isAdmin: isAdmin === 'on' || isAdmin === true
			}
		});

		res.redirect('/users');
	} catch (error) {
		console.error(error);
		res.redirect('/users/new?error=An error occurred');
	}
});

// Show form to edit a user (admin only)
router.get('/users/:id/edit', requireAdmin, async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) },
			select: {
			id: true,
			email: true,
			name: true,
			isAdmin: true
			}
		});

		if (!user) {
			return res.status(404).render('error', {
				title: 'Not Found',
				message: 'User not found'
			});
		}

		res.render('users/edit', {
			title: 'Edit User',
			user,
			error: req.query.error
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching user');
	}
});

// Process user update (admin only)
router.post('/users/:id', requireAdmin, async (req, res) => {
	try {
		const { email, name, password, isAdmin } = req.body;
		const userId = parseInt(req.params.id);

		if (!email || !name) {
			return res.redirect(`/users/${userId}/edit?error=Email and name are required`);
		}

		// Prepare update data
		const updateData = {
			email,
			name,
			isAdmin: isAdmin === 'on' || isAdmin === true
		};

		// Only update password if provided
		if (password && password.trim() !== '') {
			updateData.password = await Bun.password.hash(password);
		}

		await prisma.user.update({
			where: { id: userId },
			data: updateData
		});

		res.redirect('/users');
	} catch (error) {
		console.error(error);
		res.redirect(`/users/${req.params.id}/edit?error=An error occurred`);
	}
});

// Delete user (admin only)
router.post('/users/:id/delete', requireAdmin, async (req, res) => {
	try {
		const userId = parseInt(req.params.id);

		// Prevent deleting yourself
		if (userId === req.session.user.id) {
			return res.redirect('/users?error=You cannot delete your own account');
		}

		await prisma.user.delete({
			where: { id: userId }
		});

		res.redirect('/users');
	} catch (error) {
		console.error(error);
		res.redirect('/users?error=An error occurred while deleting the user');
	}
});

export default router;