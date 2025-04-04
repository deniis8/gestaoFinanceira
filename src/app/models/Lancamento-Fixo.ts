export interface LancamentoFixo{
    id?: number;
    diaMes: number;
    valor: number;
    descricao: string;
    status: string;
    idCCusto: number;
    descriCCusto?: string;
    idUsuario: number;
    deletado?: string;
}