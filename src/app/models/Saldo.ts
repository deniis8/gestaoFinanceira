export interface Saldo{
    id?: number;
    saldo: number;
    investimentoFixo: number;
    investimentoVariavel: number;
    gastosMesAtual: number,
	receitaMesAtual: number,
    dataHora: Date;
    idUsuario: number;
}