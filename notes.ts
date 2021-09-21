/*
  type nestedKeys<T> = {[property in keyof T]: T[property] extends object ? keyof T[property] : property}[keyof T]
  type nestedKeys<T> = {[property in keyof T]: T[property] extends object ? nestedKeys<T[property]> : property}[keyof T] //same as line 2

  interface Props {
    name: string;
    tags: {
      id: number;
      name: string;
    }
    techs: {
      id: string;
      description: string;
    }
  }

  type test = nestedKeys<Props>
  const constant: test = "id";
*/ // ---- TIPO RECURSIVO ----

//privete: Só pode ser acessado dentro da própria classe
//protected: Pode ser acessado em classes filhas       ulb-dashboard
//static: não precisa instanciar a classe antes de utilizar o método ex: Entity.""
//public: pode ser acessado em qualquer lugar da aplicação