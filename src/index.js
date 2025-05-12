import express from 'express';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes/index.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configure Handlebars
app.engine('hbs', engine({
	extname: '.hbs',
	defaultLayout: 'main',
	layoutsDir: join(__dirname, '../views/layouts'),
	partialsDir: join(__dirname, '../views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, '../views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '../public')));

// Routes
app.use(routes);

// Start server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});