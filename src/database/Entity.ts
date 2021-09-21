export interface IEntityModel<T extends { id: string }> {
  create?: (data: Partial<Omit<T, "id">>) => T;
  update?: (id: string, data: Partial<Omit<T, "id">>) => T | null;
  delete?: (id: string) => T;
  findOne?: (id: string) => T | null;
  find?: () => T[];
}

// <T extends { id: string }> = T //forçando a passar sempre o id
class Entity<T extends { id: string }> implements IEntityModel<T> { 
  private records: Record<string, T>

  constructor() {
    this.records = {}
  }

  create(data: Parameters<IEntityModel<T>["create"]>["0"]) {
    const newId = (Object.keys(this.records).length + 1).toString();

    this.records[newId] = { ...data, id: newId } as T

    return this.records[newId]
  }

  update(id: string, data: Parameters<IEntityModel<T>["update"]>["1"]) {
    const idExists = this.findOne(id)

    if (idExists) {
      this.records[id] = { ...this.records[id], ...data, id }

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

  find() {
    return Object.values(this.records)
  }

  delete(id: string) {
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
  }

}

export { Entity }