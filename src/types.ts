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

export interface Response<T>{
    message?: string;
    data: T;
}

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

export interface Imagens{
    idImagem: number;
	arquivoImagem: string
}

export interface GastosMensais{
    valor: number;
    ano: number;
    mes: string;
    dataHora?: Date;
    sobraMes: number;
    valorRecebidoMes: number;
    idUsuario: number;
}

export interface GastosCentroCusto{
    valor: number;    
    valorMesAnterior: number; 
    mesAnoMesAnterior: string;    
    descricao: string;
    dataHora: Date; 
    idUsuario: number;
}

export interface DetalhamentoGastosCentroCusto{
    valor: number;       
    descricaoLancamento: string;
    descricaoCentroCusto: string;
    dataHora: Date; 
    mesAno: string;
    idUsuario: number;
}

export interface ClimaAmbiente{
    idClimaAmbiente: number;
	dataHora: Date;
	temperatura: number;
	umidade: number;
	umidadeSolo?: number;
}

export interface CentroCusto{
    id?: number;
    descriCCusto?: string;
    deletado?: string;
}