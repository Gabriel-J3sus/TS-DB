import { Database} from "../database";
import { Entity } from "../database/Entity";

export type IUser = {
  id: string;
  name: string;
  lastName: string;
  age: number;
  products: IProduct
}

export type IProduct = {
  id: string;
  title: string;
  description: string;
}


export class Product extends Entity<IProduct> {
  constructor() {
    super()
  }
}

export class User extends Entity<IUser> {
  constructor() {
    super({ onUpdate(old, newData, date) {
      console.log(`before update: ${JSON.stringify(old, null, 1)}, updated: ${JSON.stringify(newData, null, 1)}`)
    } })
  }
}

const usersDb = new Database({ entities: { user: User, product: Product }, path: "saved_data.json" });

export { usersDb }