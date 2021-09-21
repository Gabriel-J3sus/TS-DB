import { Router } from 'express'
import { Database } from './database';
import { Entity } from './database/Entity';

const routes = Router();
interface IUser {
  id: string;
  name: string;
  lastName: string;
  age: number;
}

class User extends Entity<IUser> {
  constructor() {
    super()
  }
}
const usersDb = new Database({ user: User })

routes.get('/', (req, res) => {
  const user = usersDb.entities.user.create({ name: "Gabriel", lastName: "Jesus", age: 12 });

  return res.json(usersDb.entities.user.find())
})

export { routes }