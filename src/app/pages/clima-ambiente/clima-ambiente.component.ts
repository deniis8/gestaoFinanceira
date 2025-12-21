import { Component, OnInit } from '@angular/core';
import Chart, { registerables } from 'chart.js/auto';
import { ClimaAmbienteService } from 'src/app/services/clima-ambiente/clima-ambiente.service';
import { ClimaAmbiente, Imagens } from 'src/types';

@Component({
    selector: 'app-clima-ambiente',
    templateUrl: './clima-ambiente.component.html',
    styleUrls: ['./clima-ambiente.component.css'],
    standalone: false
})
export class ClimaAmbienteComponent implements OnInit {
   ngOnInit(): void {
  }
}/* 
  public climaAmbiente: ClimaAmbiente[] = [];
  private chartInfo: any;
  dataHora: any[] = [];
  dataHoraCabecalho: any[] = [];
  temperatura: any[] = [];
  umidade: any[] = [];
  umidadeSolo: any[] = [];
  imagens: Imagens[] = [];

  public chartUmidade: any;

  // Modal properties
  isModalOpen: boolean = false;
  modalImage: string = '';
  modalCaption: string = '';
  currentImageIndex: number = 0;

  constructor(private climaAmbienteService: ClimaAmbienteService) { }

  ngOnInit(): void {
    //Chart.register(...registerables);
    this.buscarInformacoes();
    this.buscarImagens();
  }

  criaGraficoUmidade(dataHora: any, temperatura: any, umidade: any, umidadeSolo: any) {
    const backgroundColorPlugin = {
      id: 'custom_canvas_background_color',
      beforeDraw: (chart: any) => {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#F0F8FF'; // Cor de fundo desejada
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      }
    };

    this.chartUmidade = new Chart("graficoUmidade", {
      type: 'line',
      data: {
        labels: dataHora,
        datasets: [{
          label: 'Temperatura 🔥',
          data: temperatura,
          borderColor: '#D2691E',
          backgroundColor: '#D2691E',
          fill: false,
          pointRadius: 0 // Adicionado para remover os pontos
        },
        {
          label: 'Umidade do Ar 💧',
          data: umidade,
          borderColor: '#4169E1',
          backgroundColor: '#4682B4',
          fill: false,
          pointRadius: 0 // Adicionado para remover os pontos
        },
        {
          label: 'Umidade do Solo 🌍',
          data: umidadeSolo,
          borderColor: '#D2B48C',
          backgroundColor: '#DEB887',
          fill: false,
          pointRadius: 0 // Adicionado para remover os pontos
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true
          },
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
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      plugins: [backgroundColorPlugin]
    });
  }

  buscarInformacoes() {
    this.climaAmbienteService.getClimaAmbienteService().subscribe(item => {
      this.chartInfo = item;
      console.log(item);
      if (this.chartInfo != null) {
        for (let i = 0; i < this.chartInfo.length; i++) {
          const date = new Date(this.chartInfo[i].dataHora);
          const formattedDate = this.formatDate(date);
          this.dataHora.push(formattedDate);
          this.dataHoraCabecalho.push(this.chartInfo[i].dataHora);
          this.temperatura.push(this.chartInfo[i].temperatura);
          this.umidade.push(this.chartInfo[i].umidade);
          this.umidadeSolo.push(this.chartInfo[i].umidadeSolo);
        }
        this.criaGraficoUmidade(this.dataHora, this.temperatura, this.umidade, this.umidadeSolo);
      }
    });
  }

  buscarImagens() {
    this.climaAmbienteService.getImagensService().subscribe(imagens => {
      this.imagens = imagens;
    });
  }

  openModal(index: number) {
    this.currentImageIndex = index;
    this.modalImage = this.imagens[index].arquivoImagem;
    this.modalCaption = `Imagem ${index + 1}`;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.modalImage = '';
    this.modalCaption = '';
  }

  prevImage(event: Event) {
    event.stopPropagation(); // Prevent the modal from closing
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.modalImage = this.imagens[this.currentImageIndex].arquivoImagem;
      this.modalCaption = `Imagem ${this.currentImageIndex + 1}`;
    }
  }

  nextImage(event: Event) {
    event.stopPropagation(); // Prevent the modal from closing
    if (this.currentImageIndex < this.imagens.length - 1) {
      this.currentImageIndex++;
      this.modalImage = this.imagens[this.currentImageIndex].arquivoImagem;
      this.modalCaption = `Imagem ${this.currentImageIndex + 1}`;
    }
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    //return `${day}/${month}/${year} ${hours}:${minutes}`;
    return `${day}/${month} ${hours}:${minutes}`;
  }
}*/
