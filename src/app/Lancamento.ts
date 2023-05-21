export interface Lancamento{
    id?: number;
    dataHora: Date;
    valor: number;
    descricao: string;
    status: string;
    idCCusto: number;
    descriCCusto?: string;
    idUsuario: number;
    deletado?: string;
}