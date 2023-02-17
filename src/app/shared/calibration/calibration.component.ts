import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { ICalibrateSocketResponse, ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Observable, Subscription } from 'rxjs';
import { DevicesService } from 'src/app/api/services/devices.service';
import Swal from 'sweetalert2';
import { EnumSocketCommand } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { DatePipe } from '@angular/common';
import { ICalibrateProfile, IGetLastCalibrateDetailResponse, IShowCollectCalibrateProfile } from 'src/app/api/models/calibrate_profile.model';
import { EnumCalibrateStatus } from './calibration';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.scss']
})
export class CalibrationComponent {
  @Input() calibrate_profile!:ICalibrateProfile;
  @Output() modeEvent = new EventEmitter<Mode>();
  @Output() footerMessageEvent = new EventEmitter<string>();

  isShowChart: boolean = false;
  calibrateStatus:EnumCalibrateStatus = EnumCalibrateStatus.Calibrate

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
            max: 3000,
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
              ,private devicesService:DevicesService
              ,private calibrateProfileService:CalibrateProfileService) { }

  ngOnInit() : void {
    this.isShowChart = true;

    this.socketService.getCalibrateRes().subscribe((res:ICalibrateSocketResponse) =>{
      console.log("res",res);

      if(res.command == EnumSocketCommand.ShowCollectCalibrateData && res?.data)
      {
        const data:IShowCollectCalibrateProfile = res.data;

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

  onClickStopCalibration() : void{
    this.calibrateProfileService.StopCalibrate().subscribe((res:IConnectResponse) => {
      if(res.success)
      {        
        this.calibrateStatus = EnumCalibrateStatus.Finish;
        this.footerMessageEvent.emit("STOP");

        Swal.fire({
          title: `Test Process`,
          text: `Test is stopped`,
          icon: 'info',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
        //this.modeEvent.emit(Mode.Menu);
      }
      else
      {
        Swal.fire({
          title: `Error device can't stop`,
          text: res.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    })
  }

  public get CalibrateStatus(): typeof EnumCalibrateStatus{
    return EnumCalibrateStatus;
  }

  public CalibrateDetailFormatDate(date:string){
    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedDate = datepipe.transform(date, "dd/MM/yyyy")

    return formattedDate;
  }

  public CalibrateDetailFormatTime(date:string){
    const datepipe: DatePipe = new DatePipe('en-US')
    let formattedTime = datepipe.transform(date, "hh:mm")

    return formattedTime;
  }
}
