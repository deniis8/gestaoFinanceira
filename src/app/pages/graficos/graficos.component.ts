import { Component, OnInit } from '@angular/core';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-custo/detalhamento-gastos-centro-custo.service';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais/gastos-mensais.service';
import { getColorForSobra } from '../../utils/colors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css'],
  standalone: false
})
export class GraficosComponent implements OnInit {
  [x: string]: any;

  //Variáveis grafico Gastos Mensais
  public gGMLabelMes: any[] = [];
  public gGMMesAno: any[] = [];
  public gGMDataValor: any[] = [];
  public gGMDataSobraMes: any[] = [];
  public gGMCordoQuadrante: any[] = [];
  public gGMDataValorRecebidoMes: any[] = [];

  //Variáveis gráfico Gastos por Centro de Custo
  private chartInfoCC: any;
  private gGCCValor: any[] = [];
  private gGCCValorLimite: any[] = [];
  private gGCCDescricao: any[] = [];
  private gGCCmesAnoAtual: any[] = [];

  //Detalhamento GastosCentroCusto
  popupAberto = false;
  detalhamentoGastosCC: any[] = [];

  form!: FormGroup;
  anos: number[] = [];

  loadingGastosMensais = true;
  loadingCentrosCusto = true;

  constructor(private saldoService: GastosMensaisService,
    private gastosCentroCustoService: GastosCentroCustoService,
    private detalhamentoGastosCentroCusto: DetalhamentoGastosCentroCustoService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    //Cria o formulário
    this.form = this.fb.group({
      ano: [null, Validators.required]
    });

    //this.gGMMesAnoAuxiliar = this.trataMesAnoAtual();
    this.buscarInformacoesGastosMensais("", "");

  }

  get ano() {
    return this.form.get('ano')!;
  }

  anoSelecionado(data: Date, datepicker: any) {
    const ano = data.getFullYear();
    this.form.get('ano')?.setValue(new Date(ano, 0, 1));
    datepicker.close();

    const dataDe = `${ano}-01-01`;
    const dataAte = `${ano}-12-31`;

    // limpar gráficos
    this.gGMLabelMes = [];
    this.gGMMesAno = [];
    this.gGMDataValor = [];
    this.gGMDataSobraMes = [];
    this.gGMCordoQuadrante = [];
    this.gGMDataValorRecebidoMes = [];
    this.centrosCustoVisual = [];

    // chamar API filtrada
    this.buscarInformacoesGastosMensais(dataDe, dataAte);

  }

  temRegistro(index: number): boolean {
    return !!this.gGMCordoQuadrante[index];
  }

  buscarInformacoesGastosMensais(dataDe: string, dataAte: string) {
    this.loadingGastosMensais = true;
    this.saldoService.getGastosMensais(dataDe, dataAte).subscribe(item => {
      if (!item || item.length === 0) {
        this.loadingGastosMensais = false;
        return;
      }
      for (let i = 0; i < item.length; i++) {
        this.gGMLabelMes.push(item[i].mes);
        this.gGMMesAno.push(item[i].mes + " - " + item[i].ano);
        this.gGMDataValor.push(item[i].valor);
        this.gGMDataSobraMes.push(item[i].sobraMes);
        this.gGMCordoQuadrante.push(this.getColor(item[i].sobraMes));
        this.gGMDataValorRecebidoMes.push(item[i].valorRecebidoMes);
      }
      this.loadingGastosMensais = false;
      const ultimoMes = this.gGMMesAno[this.gGMMesAno.length - 1];
      this.buscarInformacoesCentroCusto(ultimoMes);
    });
  }

  centrosCustoVisual: {
    gasto: number;
    limite: number;
    mesEAno: string;
    descricaoCentroCusto: string
  }[] = [];

  buscarInformacoesCentroCusto(mesAno?: string) {
    this.loadingCentrosCusto = true;

    this.gastosCentroCustoService.getAllGastosCentroMesAno(mesAno).subscribe(item => {
      this.chartInfoCC = item;
      this.gGCCValor = [];
      this.gGCCValorLimite = [];
      this.gGCCDescricao = [];
      this.gGCCmesAnoAtual = [];

      //NOVO: limpa a lista visual
      this.centrosCustoVisual = [];
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {

          const registro = this.chartInfoCC[i];

          this.gGCCValor.push(this.chartInfoCC[i].valor);
          this.gGCCValorLimite.push(this.chartInfoCC[i].valorLimite);
          this.gGCCDescricao.push(this.chartInfoCC[i].descricao);
          this.gGCCmesAnoAtual.push(this.chartInfoCC[i].mesAno);

          this.centrosCustoVisual.push({
            gasto: registro.valor,
            limite: registro.valorLimite,
            mesEAno: registro.mesAno,
            descricaoCentroCusto: registro.descricao
          });

          console.log(this.centrosCustoVisual);
        }
        this.loadingCentrosCusto = false;
      }
    });

  }

  getPercentual(item: any): number {
    if (!item.limite) return 0;
    return Math.min((item.gasto / item.limite) * 100);
  }

  getClasse(item: any): string {
    const percentual = this.getPercentual(item);

    if (percentual > 100) return 'estourado';
    if (percentual >= 80) return 'alerta';
    return 'ok';
  }

  private formatarData(data: string | Date): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR') + ' ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  /*
    trataMesAnoAtual() {
      let dataAtual = new Date().toLocaleDateString('pt-BR');
      let mes: string = dataAtual.toString().substring(3, 5);
      let ano: string = dataAtual.toString().substring(6, 10);
  
      switch (mes) {
        case "01": {
          mes = "Janeiro";
          break;
        }
        case "02": {
          mes = "Fevereiro";
          break;
        }
        case "03": {
          mes = "Março";
          break;
        }
        case "04": {
          mes = "Abril";
          break;
        }
        case "05": {
          mes = "Maio";
          break;
        }
        case "06": {
          mes = "Junho";
          break;
        }
        case "07": {
          mes = "Julho";
          break;
        }
        case "08": {
          mes = "Agosto";
          break;
        }
        case "09": {
          mes = "Setembro";
          break;
        }
        case "10": {
          mes = "Outubro";
          break;
        }
        case "11": {
          mes = "Novembro";
          break;
        }
        case "12": {
          mes = "Dezembro";
          break;
        }
  
      }
      let mesAno: string = mes + " - " + ano;
      return mesAno;
  
    }*/

  buscarDetalhamentoGastosCentroCusto(mesAno?: string, desCC?: string) {
    this.detalhamentoGastosCentroCusto.getAllDetalhamentoGastosCentroMesAno(mesAno, desCC).subscribe(item => {
      this.detalhamentoGastosCC = [];
      if (item && item.length > 0) {        
        this.detalhamentoGastosCC = item;
        this.popupAberto = true; //abre o pop-up
      }
    });
  }

  getColor(valor: number) {
    return getColorForSobra(valor);
  }

}
