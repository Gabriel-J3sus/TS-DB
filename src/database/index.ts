import fs from 'fs'
import { ConstructorParams, EntityCollection, EntityInterface, IEntity, PopulateKey, ResolveRelation} from '../DatabaseTypes'
import { Entity } from './Entity'

class Database<T extends Record<string, Entity<any>>,K = keyof T > {
  entities: T
  path: string
 
  constructor({ entities, path }: ConstructorParams<T>) {
    this.entities = {} as T
    this.path = path

    for(const entityClass in entities) {
      this.entities[entityClass] = new (entities[entityClass])()
    }

    this.load()
  } 
  
  save() {
    if (this.path) {
      let data = {} as any
      
      for (const entityClass in this.entities) {
        data[entityClass] = this.entities[entityClass].serialize()
      }
      
      fs.writeFile(this.path, JSON.stringify(data, null, 1), { encoding: 'utf-8' }, () => console.log('saved data'))
    } 
  }

  relate<A extends T[keyof T]['records'][string]>(entity:Extract<K,string>,values:  A| A[] ){
    return this.entities[entity].relate(values,entity) as unknown as [K,ResolveRelation<A[PopulateKey<A>]>]
  }
  
  findPopulatable<A extends IEntity>(k:boolean|string[],entity:A){
    let populatable = []
    const entities = Object.keys(this.entities)
    
    Object.entries(entity).forEach(([key,value]) => {
      const isPopulatable = Array.isArray(value) && entities.includes(value[0])
      const shouldPush = typeof k === 'boolean' || k.includes(key)
    
      if(shouldPush && isPopulatable){
       populatable.push(key)
      }  
    })

    return populatable
  }

  populate<A extends IEntity>(entity:EntityInterface< A>,key:PopulateKey<A>| PopulateKey<A>[]|boolean){
    let populated = {...entity}
    const keysArr = typeof key === 'string' ?  [key] : this.findPopulatable(key as string[],entity)
     
    for(const key of keysArr){
      let [table,ids] = entity[key]
      const entityName = table as Extract<K,string>

      if(Array.isArray(ids)){
        const data = this.entities[entityName].find(ids)

        populated[key] = data

        if (data.length < 1) {
          this.entities[entityName].update(entity.id, {[ key ]: null}) // ******* deletar referencias ************
        }

      }else{
        const data = this.entities[entityName].findOne(ids)

        populated[key] = data

        if (!data) {
          this.entities[entityName].update(entity.id, {[ key ]: null}) // ******* deletar referencias ************
        }
      }
    }

    this.save()
    return populated as A
  }
  
  load() {
    if (this.path) {
      try {
        const data = JSON.parse(fs.readFileSync(this.path).toString()) as EntityCollection<T>

        Object.entries(data).forEach(([ entity, savedData ]) => {
          this.entities[entity].load(savedData) 
        })
      } catch {}
    }
  }
}

export { Database }