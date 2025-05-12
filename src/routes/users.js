import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// List all users
router.get('/users', async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.render('users/index', { users });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching users');
	}
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: parseInt(req.params.id) }
		});

		if (!user) {
			return res.status(404).send('User not found');
		}

		res.render('users/show', { user });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching user');
	}
});

export default router;