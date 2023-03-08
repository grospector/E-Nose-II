import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { DevicesService } from 'src/app/api/services/devices.service';
import Swal from 'sweetalert2';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import { Observable } from 'rxjs';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { UsersService } from 'src/app/api/services/users.service';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { chartBasicData, chartBasicOptions } from './chart';

@Component({
  selector: 'app-check-init',
  templateUrl: './check-init.component.html',
  styleUrls: ['./check-init.component.scss']
})
export class CheckInitComponent {
  @Input() ConnectingStatus:EnumConnectionStatus = EnumConnectionStatus.Test;
  @Output() modeEvent = new EventEmitter<Mode>();
  @Output() footerMessageEvent = new EventEmitter<string>();

  isShowChart: boolean = false;

  basicData: any = chartBasicData;
  basicOptions:any = chartBasicOptions;

  collectingData!: Observable<ISocketResponse>;
  tempData:number = 0;
  pressureData:number = 0;

  constructor(private socketService:SocketService
              ,private devicesService:DevicesService
              ,private usersService:UsersService) { }

  ngOnInit() : void {
    this.CheckDeviceInitStep();
  }

  CheckDeviceInitStep() : void{
    this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        switch(res?.device?.status)
        {
          case EnumConnectionStatus.StopTest:
            this.isShowChart = true;
            this.GetSocketResponse();
            break;
          case EnumConnectionStatus.Cleaning:
            this.isShowChart = true;
            //this.GetSocketResponse();
            break;
          case EnumConnectionStatus.Test:
          default:
            this.isShowChart = true;
            this.GetSocketResponse();
            break;
        }
      }
    });
  }

  GetSocketResponse() : void{
    this.socketService.getNewRes().subscribe((res:ISocketResponse) =>{
      console.log("res",res);

      if(res.command == EnumSocketCommand.ShowTestData && res?.data?.test_item)
      {
        const data:ITestItem = res.data.test_item;

        this.basicData.labels.push(ToolUtils.FormatTimeMinute(new Date().toString()));

        //const pressure = this.basicData.datasets.find((x:any) => x.label == 'Pressure').data;
        //const temp = this.basicData.datasets.find((x:any) => x.label == 'Temp').data;
        const gas_1 = this.basicData.datasets.find((x:any) => x.label == 'Gas 1').data;
        const gas_2 = this.basicData.datasets.find((x:any) => x.label == 'Gas 2').data;
        const gas_3 = this.basicData.datasets.find((x:any) => x.label == 'Gas 3').data;
        const gas_4 = this.basicData.datasets.find((x:any) => x.label == 'Gas 4').data;
        const gas_5 = this.basicData.datasets.find((x:any) => x.label == 'Gas 5').data;
        const gas_6 = this.basicData.datasets.find((x:any) => x.label == 'Gas 6').data;
        const gas_7 = this.basicData.datasets.find((x:any) => x.label == 'Gas 7').data;

        this.tempData = data.temp;
        this.pressureData = data.pressure;

        if(this.basicData.labels.length <= 30)
        {
          //pressure.push(data?.pressure);
          //temp.push(data?.temp);
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
          //pressure.splice(0,1);
          //temp.splice(0,1);
          gas_1.splice(0,1);
          gas_2.splice(0,1);
          gas_3.splice(0,1);
          gas_4.splice(0,1);
          gas_5.splice(0,1);
          gas_6.splice(0,1);
          gas_7.splice(0,1);

          //pressure.push(data?.pressure);
          //temp.push(data?.temp);
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
    });
  }

  onClickStopTesting() : void{
    this.devicesService.CommandStopTest().subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.modeEvent.emit(Mode.StopTest);

        // Swal.fire({
        //   title: `Test Process`,
        //   text: `Test is stopped`,
        //   icon: 'info',
        //   confirmButtonText: 'OK'
        // }).then(
        //   (result) => {
        //   }
        // );
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
}