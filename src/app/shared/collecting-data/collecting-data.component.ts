import { Component, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IDevice } from 'src/app/api/models/device.model';
import { ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-collecting-data',
  templateUrl: './collecting-data.component.html',
  styleUrls: ['./collecting-data.component.scss']
})
export class CollectingDataComponent {
  basicData: any = {
    labels: [new Date().toISOString()],
    datasets: [
      {
        label: 'Pressure',
        data: [0],
        fill: false,
        borderColor: '#42A5F5',
        tension: .4
      },
      {
        label: 'Temp',
        data: [0],
        fill: false,
        borderColor: '#FFA726',
        tension: .4
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
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057',
                min: 0,
                max: 100,
            },
            grid: {
                drawOnChartArea: false,
                color: '#ebedef'
            }
        }
    }
  };

  datasets!:any[];

  collectingData!: Observable<ISocketResponse>;


  constructor(private socketService:SocketService) { }

  ngOnInit() : void {
    this.socketService.getNewRes().subscribe((res:ISocketResponse) =>{
      console.log("res",res);

      if(res?.data?.test_item)
      {
        const data:ITestItem = res.data.test_item;

        this.basicData.labels.push(new Date().toISOString());
        this.basicData.datasets[0].data.push(data?.pressure);
        this.basicData.datasets[1].data.push(data?.temp);
      }

      this.basicData = {...this.basicData};
    })
  }
}
