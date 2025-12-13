import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DetalhamentoGastosCentroCustoService } from 'src/app/services/detalhamento-gastos-custo/detalhamento-gastos-centro-custo.service';
import { GastosCentroCustoService } from 'src/app/services/gastos-centro-custo/gastos-centro-custo.service';
import { GastosMensaisService } from 'src/app/services/gastos-mensais/gastos-mensais.service';
import { getColorForSobra } from '../../utils/colors';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  private gGMMesAnoAuxiliar?: string = "";
  //public gGMChart: any;

  //Variáveis gráfico Gastos por Centro de Custo
  private chartInfoCC: any;
  private gGCCValor: any[] = [];
  private gGCCValorLimite: any[] = [];
  private gGCCDescricao: any[] = [];
  private gGCCmesAnoAtual: any[] = [];
  private gGCCmesAnoAnterior: any[] = [];
  public gGCCChart: any;

  //Detalhamento GastosCentroCusto
  detalhamentoGastosCC: any[] = [];

  form!: FormGroup;
  anos: number[] = [];

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

    this.gGMMesAnoAuxiliar = this.trataMesAnoAtual();
    this.buscarInformacoes("", "");

  }

  get ano() {
    return this.form.get('ano')!;
  }

  anoSelecionado(data: Date, datepicker: any) {
    this.gGCCChart.destroy();
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

    // chamar API filtrada
    this.buscarInformacoes(dataDe, dataAte);

  }

  temRegistro(index: number): boolean {
    return !!this.gGMCordoQuadrante[index];
  }

  buscarInformacoes(dataDe: string, dataAte: string) {
    this.saldoService.getGastosMensais(dataDe, dataAte).subscribe(item => {
      if (!item || item.length === 0) {
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
      const ultimoMes = this.gGMMesAno[this.gGMMesAno.length - 1];
      this.buscarInformacoesGraficoCentroCusto(ultimoMes);
    });
  }

  //Gráfico Gastos por Centro de Custo
  criaGraficoGastosCentroCusto(gGCCDescricao: any, gGCCValor: any, gGCCValorLimite: any, gGCCmesAnoAtual: any, gGCCmesAnoAnterior: any) {

    const coresValor = gGCCValor.map((valor: number, index: number) => {
      return valor > gGCCValorLimite[index] ? '#f5736fff' : '#0e7b29ff';
    });

    this.gGCCChart = new Chart("gGCCChart", {
      type: 'bar',
      data: {
        labels: gGCCDescricao,
        datasets: [
          {
            label: 'Valor Limite',
            data: gGCCValorLimite,
            borderWidth: 0,
            borderColor: '#000000',
            backgroundColor: '#728cb4ff'
          },
          {
            label: 'Valor Gasto',
            data: gGCCValor,
            borderWidth: 0,
            borderColor: '#000000',
            backgroundColor: coresValor
          }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            color: '#555555',
            font: {
              weight: 'bold',
              size: 8
            },

            formatter: function (value: any) {
              return value;
            }
          },
          tooltip: {
            enabled: false // Desativa o tooltip
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        onClick: (event: any) => {
          const points = this.gGCCChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);

          if (points.length) {
            const firstPoint = points[0];
            const datasetIndex = firstPoint.datasetIndex;
            const index = firstPoint.index;

            const desCC = this.gGCCChart.data.labels[index];
            const valor = this.gGCCChart.data.datasets[datasetIndex].data[index];

            let mesAno = '';
            mesAno = gGCCmesAnoAtual[index];
            this.buscarDetalhamentoGastosCentroCusto(mesAno, desCC);
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  buscarInformacoesGraficoCentroCusto(mesAno?: string) {
    this.gGMMesAnoAuxiliar = mesAno;

    if (this.gGCCChart) {
      this.gGCCChart.destroy();
    }

    this.gastosCentroCustoService.getAllGastosCentroMesAno(mesAno).subscribe(item => {
      this.chartInfoCC = item;
      this.gGCCValor = [];
      this.gGCCValorLimite = [];
      this.gGCCDescricao = [];
      this.gGCCmesAnoAtual = [];
      this.gGCCmesAnoAnterior = [];
      if (this.chartInfoCC != null) {
        for (let i = 0; i < this.chartInfoCC.length; i++) {

          this.gGCCValor.push(this.chartInfoCC[i].valor);
          this.gGCCValorLimite.push(this.chartInfoCC[i].valorLimite);
          this.gGCCDescricao.push(this.chartInfoCC[i].descricao);
          this.gGCCmesAnoAtual.push(this.chartInfoCC[i].mesAno);
          this.gGCCmesAnoAnterior.push(this.chartInfoCC[i].mesAnoMesAnterior);
        }
        this.criaGraficoGastosCentroCusto(this.gGCCDescricao, this.gGCCValor, this.gGCCValorLimite, this.gGCCmesAnoAtual, this.gGCCmesAnoAnterior);
        this.buscarDetalhamentoGastosCentroCusto(this.gGMMesAnoAuxiliar, [...this.gGCCDescricao].pop());
      }
    });

  }

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

  }

  buscarDetalhamentoGastosCentroCusto(mesAno?: string, desCC?: string) {
    this.detalhamentoGastosCentroCusto.getAllDetalhamentoGastosCentroMesAno(mesAno, desCC).subscribe(item => {
      let infoDetalhamento = item;
      this.detalhamentoGastosCC = [];
      if (infoDetalhamento != null) {
        for (let i = 0; i < infoDetalhamento.length; i++) {
          this.detalhamentoGastosCC.push(infoDetalhamento[i])
        }
      }
    });
  }

  getColor(valor: number) {
    return getColorForSobra(valor);
  }

}
