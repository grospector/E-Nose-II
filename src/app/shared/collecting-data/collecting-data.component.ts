import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';
import { EnumSocketCommand } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import { TestsService } from 'src/app/api/services/tests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collecting-data',
  templateUrl: './collecting-data.component.html',
  styleUrls: ['./collecting-data.component.scss']
})
export class CollectingDataComponent {
  @Input() isProcess:boolean = true;
  @Output() modeEvent = new EventEmitter<Mode>;

  testId : number = 0;

  basicData: any = {
    labels: [],
    datasets: [
      {
        label: 'Pressure',
        data: [],
        hidden: true,
        borderColor: '#e3342f',
      },
      {
        label: 'Temp',
        data: [],
        hidden: true,
        borderColor: '#f6993f',
      },
      {
        type: 'line',
        label: 'Gas 1',
        data: [],
        fill: false,
        borderColor: '#ffed4a',
        tension: 0
      },
      {
        label: 'Gas 2',
        data: [],
        fill: false,
        borderColor: '#38c172',
        tension: 0
      },
      {
        label: 'Gas 3',
        data: [],
        fill: false,
        borderColor: '#4dc0b5',
        tension: 0
      },
      {
        label: 'Gas 4',
        data: [],
        fill: false,
        borderColor: '#3490dc',
        tension: 0
      },
      {
        label: 'Gas 5',
        data: [],
        fill: false,
        borderColor: '#6574cd',
        tension: 0
      },
      {
        label: 'Gas 6',
        data: [],
        fill: false,
        borderColor: '#9561e2',
        tension: 0
      },
      {
        label: 'Gas 7',
        data: [],
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
            //max: 100,
        }
    },
    interaction: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItem:any) {
          //console.log("tooltipItem",tooltipItem);
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


  constructor(private socketService:SocketService
              ,private testsService:TestsService) { }

  ngOnInit() : void {
    this.socketService.getNewRes().subscribe((res:ISocketResponse) =>{
      if(res.command == EnumSocketCommand.ShowCollectData && res?.data?.test_item)
      {
        console.log("res",res);

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

        this.testId = res.data.test_item.test_id;

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

  onClickStopCollectingData() : void{
    this.testsService.StopTest(this.testId).subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.isProcess = false;
      }
      else{
        Swal.fire({
          title: `Error device can't stop collecting data`,
          text: res.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    });
  }

  onClickFinishCollectingData() : void{
    this.testsService.EndTest(this.testId).subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        
      }
      else{
        Swal.fire({
          title: `Error device can't finish collecting data`,
          text: res.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    });
  }

  public get Mode(): typeof Mode {
    return Mode; 
  }
}
