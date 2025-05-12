import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User data array
const users = [
    {
        email: 'admin@db4.ee',
        name: 'admin',
        password: 'admin',
        isAdmin: true
    },
    {
        email: 'test@test.test',
        name: 'test',
        password: 'test',
        isAdmin: false
    }
];

async function main() {
	console.log('Start seeding...');

	// Clear existing data
	await prisma.user.deleteMany();

	// Create users with hashed passwords
	for (const user of users) {
		const hashedPassword = await Bun.password.hash(user.password);
		await prisma.user.create({ data: { ...user, password: hashedPassword } });
	}
	console.log('Created users, seeding finished');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});