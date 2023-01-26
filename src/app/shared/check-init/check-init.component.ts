import { Component, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IDevice } from 'src/app/api/models/device.model';
import { ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-check-init',
  templateUrl: './check-init.component.html',
  styleUrls: ['./check-init.component.scss']
})
export class CheckInitComponent {

  basicData: any = {
    labels: [new Date().toLocaleString()],
    datasets: [
      {
        label: 'Pressure',
        data: [0],
        hidden: true,
        borderColor: '#e3342f',
      },
      {
        label: 'Temp',
        data: [0],
        hidden: true,
        borderColor: '#f6993f',
      },
      {
        type: 'line',
        label: 'Gas 1',
        data: [0],
        fill: false,
        borderColor: '#ffed4a',
        tension: 0
      },
      {
        label: 'Gas 2',
        data: [0],
        fill: false,
        borderColor: '#38c172',
        tension: 0
      },
      {
        label: 'Gas 3',
        data: [0],
        fill: false,
        borderColor: '#4dc0b5',
        tension: 0
      },
      {
        label: 'Gas 4',
        data: [0],
        fill: false,
        borderColor: '#3490dc',
        tension: 0
      },
      {
        label: 'Gas 5',
        data: [0],
        fill: false,
        borderColor: '#6574cd',
        tension: 0
      },
      {
        label: 'Gas 6',
        data: [0],
        fill: false,
        borderColor: '#9561e2',
        tension: 0
      },
      {
        label: 'Gas 7',
        data: [0],
        fill: false,
        borderColor: '#f66d9b',
        tension: 0
      }
    ]
  };

  basicOptions:any = {
    animation: {
        duration: 0
    },
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#495057'
            }
        },
        y: {
            ticks: {
                color: '#495057',
            },
            grid: {
                drawOnChartArea: false,
                color: '#495057'
            },
            beginAtZero: true,
            min: 0,
            max: 100,
        }
    },
    interaction: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItem:any) {
          console.log("tooltipItem",tooltipItem);
          var label = tooltipItem.dataset.label || '';
          if (label) {
              label += ': ';
          }
          label += tooltipItem.formattedValue;
          return label;
      }

      }
    },
    clip: {left: false, top: false, right: 1000, bottom: false},
    pointBorderWidth:5,
    pointHoverBorderWidth:10
  };

  collectingData!: Observable<ISocketResponse>;


  constructor(private socketService:SocketService) { }

  ngOnInit() : void {
    this.socketService.getNewRes().subscribe((res:ISocketResponse) =>{
      console.log("res",res);

      if(res?.data?.test_item)
      {
        const data:ITestItem = res.data.test_item;

        this.basicData.labels.push(new Date().toLocaleString());

        const pressure = this.basicData.datasets.find((x:any) => x.label == 'Pressure').data;
        const temp = this.basicData.datasets.find((x:any) => x.label == 'Temp').data;
        const gas_1 = this.basicData.datasets.find((x:any) => x.label == 'Gas 1').data;
        const gas_2 = this.basicData.datasets.find((x:any) => x.label == 'Gas 2').data;
        const gas_3 = this.basicData.datasets.find((x:any) => x.label == 'Gas 3').data;
        const gas_4 = this.basicData.datasets.find((x:any) => x.label == 'Gas 4').data;
        const gas_5 = this.basicData.datasets.find((x:any) => x.label == 'Gas 5').data;
        const gas_6 = this.basicData.datasets.find((x:any) => x.label == 'Gas 6').data;
        const gas_7 = this.basicData.datasets.find((x:any) => x.label == 'Gas 7').data;

        if(this.basicData.labels.length <= 30)
        {
          pressure.push(data?.pressure);
          temp.push(data?.temp);
          gas_1.push(data?.gas_1);
          gas_2.push(data?.gas_2);
          gas_3.push(data?.gas_3);
          gas_4.push(data?.gas_4);
          gas_5.push(data?.gas_5);
          gas_6.push(data?.gas_6);
          gas_7.push(data?.gas_7);
        }
        else{
          this.basicData.labels.splice(0,1);
          pressure.splice(0,1);
          temp.splice(0,1);
          gas_1.splice(0,1);
          gas_2.splice(0,1);
          gas_3.splice(0,1);
          gas_4.splice(0,1);
          gas_5.splice(0,1);
          gas_6.splice(0,1);
          gas_7.splice(0,1);

          pressure.push(data?.pressure);
          temp.push(data?.temp);
          gas_1.push(data?.gas_1);
          gas_2.push(data?.gas_2);
          gas_3.push(data?.gas_3);
          gas_4.push(data?.gas_4);
          gas_5.push(data?.gas_5);
          gas_6.push(data?.gas_6);
          gas_7.push(data?.gas_7);
        }
      }

      this.basicData = {...this.basicData};
    })
  }
}
