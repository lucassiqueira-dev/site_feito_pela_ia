/**
 * Tipos de dados compartilhados da aplicação IF-Task.
 * Estes tipos representam o formato esperado das entidades que virão do
 * backend / banco de dados no futuro. Mantê-los centralizados facilita a
 * troca dos dados simulados por respostas reais da API.
 */

/** Representa uma atividade registrada por um bolsista. */
export interface Atividade {
  /** Identificador único gerado pelo banco de dados (ex.: PK autoincremento ou UUID). */
  id: string
  /** Data em que a atividade foi realizada (formato ISO: "AAAA-MM-DD"). */
  data: string
  /** Descrição textual da tarefa executada. */
  descricao: string
  /** Quantidade de horas dedicadas à atividade. */
  horas: number
}

/** Dados enviados ao criar uma nova atividade (sem o id, gerado pelo backend). */
export type NovaAtividade = Omit<Atividade, 'id'>

/** Representa o bolsista autenticado. */
export interface Bolsista {
  matricula: string
  nome: string
}

/** Credenciais enviadas na tela de login. */
export interface Credenciais {
  matricula: string
  senha: string
}
