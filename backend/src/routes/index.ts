import {Router} from 'express';
import {usersRouter} from '../modules/users/users.routes.js';
import {restaurantsRouter} from '../modules/restaurants/restaurants.routes.js';
import {productsRouter} from '../modules/products/products.routes.js';
import {ordersRouter} from '../modules/orders/orders.routes.js';
import {authRouter} from '../modules/auth/auth.routes.js';
import { addressesRouter } from '../modules/addresses/addresses.routes.js';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/restaurants', restaurantsRouter);
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);
routes.use('/auth', authRouter);
routes.use('/addresses', addressesRouter);
