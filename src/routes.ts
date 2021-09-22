import { Router } from 'express'
import { IUser, Product, User, usersDb } from './controller/user';
import { Database } from './database';
import { Entity } from './database/Entity';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json(usersDb.entities.user.find())
})

routes.post('/create', (req, res) => {
  const product = usersDb.entities.product.create({ title: "Suco de laranja", description: "Suco do bão" });
  const user = usersDb.entities.user.create({...req.body, products: usersDb.relate("product", [product])});
  
  usersDb.save()

  return res.json({product, user})
})

routes.post('/create', (req, res) => {
  const product = usersDb.entities.product.create(req.body);
  const product2 = usersDb.entities.product.create({...req.body, friend: usersDb.relate('product', [product]) });

  usersDb.save()

  return res.json({product, product2})
})

routes.put('/update/:id', (req, res) => {
  const user = usersDb.entities.user.update(req.params.id, req.body);

  usersDb.save()
  
  return res.json(user)
})

routes.delete('/delete/:id', (req, res) => {
  const user = usersDb.entities.user.delete(req.params.id);

  usersDb.save()

  return res.json(user)
})

routes.get('/findone/:id', (req, res) => {
  const user = usersDb.entities.user.findOne(req.params.id);

  return res.json(usersDb.populate<IUser>(user, "products"))
})


export { routes }