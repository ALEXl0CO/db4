import prisma from '../db.js';

export async function registerUser(email, name, password) {
	// Hash the password using Bun's built-in password hashing
	const hashedPassword = await Bun.password.hash(password);
	
	return prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword
		}
	});
}

export async function verifyUser(email, password) {
	const user = await prisma.user.findUnique({
		where: { email }
	});
	
	if (!user) {
		return null;
	}

	// Verify the password using Bun's built-in password verification
	const isValid = await Bun.password.verify(password, user.password);

	if (isValid) {
		// Don't return the password
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	return null;
}