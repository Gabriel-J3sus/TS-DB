import { Entity } from "./Entity";

type WithConstructors<T> = {[property in keyof T]: new () => T[property]};

class Database<T extends Record<string, Entity<any>>> {
  entities: T

  constructor(entities: WithConstructors<T>) {
    this.entities = {} as T
    
    for(const entityClass in entities) {
      this.entities[entityClass] = new (entities[entityClass])()
    }
  }  
}

export { Database }