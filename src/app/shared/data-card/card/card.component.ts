import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, CardModule], 
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @ViewChild('chartCanvas', { static: false }) chartRef?: ElementRef<HTMLCanvasElement>;

  @Input() chartData?: { labels: string[], datasets: any[] };
  @Input() chartType: any = 'bar';

  @Input() title?: string;
  @Input() value?: string;

  chart?: Chart;

  ngOnInit(): void {
    if (this.chartData && this.chartRef) {
      this.createChart();
    }
  }

  ngAfterViewInit(): void {
    if (this.chartData && this.chartRef) {
      this.createChart();
    }
  }

  createChart(): void {
    if (this.chartRef && this.chartData) {
      this.chart = new Chart(this.chartRef.nativeElement, {
        type: this.chartType,
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, labels: {
        color: '#ffff' ,
         font: {
          weight: 'bold'  
        }
      } }
          }
        }
      });
    }
  }
}
