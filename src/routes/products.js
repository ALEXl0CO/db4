import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// List all products
router.get('/products', async (req, res) => {
	try {
		const products = await prisma.product.findMany();
		res.render('products/index', { products });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching products');
	}
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
	try {
		const product = await prisma.product.findUnique({
			where: { id: parseInt(req.params.id) }
		});
		
		if (!product) {
			return res.status(404).send('Product not found');
		}

		res.render('products/show', { product });
	} catch (error) {
		console.error(error);
		res.status(500).send('Error fetching product');
	}
});

export default router;