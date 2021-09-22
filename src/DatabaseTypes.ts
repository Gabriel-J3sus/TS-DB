export interface ConstructorParams<T> {
  entities: WithConstructors<T>;
  path?: string
}
export interface IEntity {
  id: string
}
export type ResolveRelation <T> = T extends Array<any> ? [string,string[]] : [string,string]  

export type EntityInterface<T extends IEntity> = {
  [property in keyof T] :T[property] extends IEntity | IEntity[] ? ResolveRelation<T[property]>  :  T[property]  
} & {id:string}

export type WithConstructors<T> = {
  [property in keyof T]: new () => T[property]
};

export type EntityCollection<T> = {
  [property in keyof T]: T[property][]
};

export type PopulateKey<T extends IEntity> = {
  [property in keyof T]: T[property] extends IEntity | IEntity[] ? property : never
}[keyof T];

export type MultiEntityInterface<T extends Record<string, IEntity>> = {
  [property in keyof T]: EntityInterface<T[property]>
}