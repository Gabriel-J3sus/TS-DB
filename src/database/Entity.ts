import { v4 as uuid } from 'uuid'
import { EntityInterface, IEntity } from '../DatabaseTypes';

export interface IEntityModel<T extends EntityInterface<any>> {
  serialize?: (data?: T) => Partial<T> | Partial<T>[]
  create?: (data: Partial<Omit<T, "id">>) => T;
  update?: (id: string, data: Partial<Omit<T, "id">>) => T | null;
  delete?: (id: string | string[]) => T[] | T;
  findOne?: (id: string) => T | null;
  find?: () => T[];
  relate?: (entity:T|T[],as:string) => [string,(string|string[])]
}

type EntityEvents<T> = {
  onUpdate: (old: T, updated: T, date: Date) => void
}

const defaultEvents: EntityEvents<any> = {
  onUpdate(old, updated, date) {
    console.log(`${date.toString()} updated id: ${updated.id}`)
  }
}
//implementar o resto

// <T extends { id: string }> = T //forçando a passar sempre o id
class Entity<T extends IEntity,EI extends EntityInterface<T> = EntityInterface<T>> implements IEntityModel<EI> { 
  records: Record<string, EI>;
  public events: EntityEvents<EI>

  constructor(events?: EntityEvents<EI>) {
    this.records = {}
    this.events = {...defaultEvents, ...events}
  }

  serialize(data?: EI) {
    if (data) {
      return data
    } else {
      return Object.values(this.records)
    }
  }

  load(data: EI | EI[]) {
    if(Array.isArray(data)){
      this.records = Object.fromEntries(data.map(dt => ([dt.id, dt])))
    }else{
      return [data.id,data]
    }
  }

  create(data: Parameters<IEntityModel<EI>["create"]>["0"]) {
    const newId = uuid();

    this.records[newId] = { ...data, id: newId } as unknown as EI

    return this.records[newId]
  }

  relate(entity:EI|EI[],as:string){
    if(Array.isArray(entity)){
      return [as,entity.map(({id}) => id)] as ReturnType<IEntityModel<EI>['relate']>
    }else{
      return  [as,entity.id] as ReturnType<IEntityModel<EI>['relate']>
    }
  }

  update(id: string, data: Parameters<IEntityModel<EI>["update"]>["1"]) {
    const idExists = this.findOne(id)

    if (idExists) {
      const newData = { ...this.records[id], ...data, id }
      this.events.onUpdate(this.records[id], newData, new Date())

      this.records[id] = newData;


      return this.records[id]
    } else {
      return null
    }
  }
  
  findOne(id: string) {
    const row = this.records[id]

    if (row) {
      return row
    } else {
      return null
    }
  }
  
  find(ids?:string[]) {
    if(ids){
        return Object.values(this.records).filter(({id}) => ids.includes(id))
    }
    return Object.values(this.records)
  }

  delete(id: string | string[]) {
    const ids = typeof id === 'string' ? [id] : id;
    
    const deleted = ids.map(id => {
      const idExists = this.findOne(id)
      
      if (idExists) {
        let newRecords = { ...this.records } //sem o spread eu tenho apenas o valor do objeto e não a referencia
        // referencia faz mudar o valor que eu passo para próxima váriavel (basicamente linka as variaveis)
      
        delete newRecords[id] //delete é realmente um operador. Paulinho acha foda
          
        this.records = newRecords
        
        return idExists;
      } else {
        return null
      }
    })

    return typeof id === "string" ? deleted[0] : deleted
  }
}

export { Entity }