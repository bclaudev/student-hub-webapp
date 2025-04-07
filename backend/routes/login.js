import { Hono } from 'hono';
import { login } from '../controllers/loginController.js';

const loginRoute = new Hono();

loginRoute.post('/', login);

export default loginRoute;
