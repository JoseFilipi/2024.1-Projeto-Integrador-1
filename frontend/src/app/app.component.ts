import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import Circuito from 'src/interfaces/Circuito';
import { CircuitoService } from 'src/services/circuito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('graficoRadar', { static: true }) elementRefRadar!: ElementRef;
  @ViewChild('graficoBar', { static: true }) elementRefBar!: ElementRef;
  @ViewChild('graficoLine', { static: true }) elementRefLine!: ElementRef;

  circuitos: Circuito[] = [];
  load: boolean = false;

  constructor(
    private circuitoService: CircuitoService
  ) { }

  ngOnInit(): void {
    this.buscarCircuitos();
  }

  buscarCircuitos(): void {
    this.circuitoService.getAllCircuits().subscribe((response) => {
      this.circuitos = response;
      this.load = true;
      this.instanciarGrafico();
    });
  }

  instanciarGrafico(): void {
    Chart.register(...registerables);

    const radarData: any = this.circuitos.map(c => ({
      label: `Circuito ${this.circuitos.indexOf(c) + 1}`,
      data: [c.instant_speed, c.instant_acceleration, c.energy_consumed, c.travelled_distance, c.travel_time],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgb(255, 99, 132)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(255, 99, 132)'
    }));

    const configRadar: ChartConfiguration = {
      type: 'radar',
      data: {
        labels: ['Velocidade (m/s)', 'Aceleração (m/s²)', 'Consumo de Energia', 'Distância Percorrida (m)', 'Tempo de Viagem (s)'],
        datasets: radarData
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 5,
            title: {
              display: true,
              text: 'Valores'
            }
          }
        }
      }
    };

    new Chart(this.elementRefRadar.nativeElement, configRadar);

    const configBar: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.circuitos.map(c => `Circuito ${this.circuitos.indexOf(c) + 1}`),
        datasets: [{
          label: 'Consumo de Energia',
          data: this.circuitos.map(c => c.energy_consumed),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Consumo de Energia'
            }
          }
        }
      }
    };

    new Chart(this.elementRefBar.nativeElement, configBar);

    const configLine: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.circuitos.map(c => `Circuito ${this.circuitos.indexOf(c) + 1}`),
        datasets: [{
          label: 'Tempo de Viagem (s)',
          data: this.circuitos.map(c => c.travel_time),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Distância (m)',
          data: this.circuitos.map(c => c.travelled_distance),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    }

    new Chart(this.elementRefLine.nativeElement, configLine);

  }

}