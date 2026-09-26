export interface Saldo {
    id?: number;
    saldo: number;
    investimentoFixo: number;
    investimentoVariavel: number;
    gastosMesAtual: number,
    receitaMesAtual: number,
    dataHora: Date;
    idUsuario: number;
}

export interface Response<T> {
    message?: string;
    data: T;
}

export type StatusLancamento = 'A Pagar' | 'Pago' | 'A Receber' | 'Recebido';

export interface Lancamento {
    id?: number;
    dataHora: Date | string;
    valor: number;
    descricao: string;
    status: string;
    idCCusto: number;
    descriCCusto?: string;
    idUsuario: number;
    deletado?: string;
}

/** Dados que o formulário de lançamento entrega (dataHora vem do input datetime-local). */
export interface LancamentoPayload {
    dataHora: string;
    valor: number;
    descricao: string;
    status: string;
    idCCusto: number;
}

export interface LancamentoFixo {
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

export interface LancamentoFixoPayload {
    diaMes: number;
    valor: number;
    descricao: string;
    status: string;
    idCCusto: number;
}

export interface Imagens {
    idImagem: number;
    arquivoImagem: string
}

export interface GastosMensais {
    valor: number;
    ano: number;
    mes: string;
    dataHora?: Date;
    sobraMes: number;
    valorRecebidoMes: number;
    idUsuario: number;
}

export interface GastosCentroCusto {
    valor: number;
    valorLimite: number;
    valorMesAnterior: number;
    mesAnoMesAnterior: string;
    descricao: string;
    dataHora: Date;
    mesAno: string;
    idUsuario: number;
}

export interface DetalhamentoGastosCentroCusto {
    id: number;
    valor: number;
    descricaoLancamento: string;
    descricaoCentroCusto: string;
    dataHora: Date;
    mesAno: string;
    idUsuario: number;
}

export interface ClimaAmbiente {
    idClimaAmbiente: number;
    dataHora: Date;
    temperatura: number;
    umidade: number;
    umidadeSolo?: number;
}

export interface CentroCusto {
    id?: number;
    descriCCusto?: string;
    deletado?: string;
    valorLimite: number;
}

export interface CentroCustoPayload {
    descriCCusto: string;
    valorLimite: number;
}

export interface ConfiguracoesIA {
    id?: number,
    filtroDataDe: Date | string,
    filtroDataAte: Date | string,
    prompt: string,
    idUsuario: number
}

export interface AnaliseFinanceiraIaRequest {
    idUsuario: number;
    dataDe: string;   // yyyy-MM-dd
    dataAte: string;  // yyyy-MM-dd
    textoAuxiliar: string;
}

export interface AnaliseFinanceiraIaResponse {
    analiseIA: string;
}
