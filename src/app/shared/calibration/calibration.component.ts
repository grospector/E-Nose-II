import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { ICalibrateSocketResponse, ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Observable, Subscription } from 'rxjs';
import { DevicesService } from 'src/app/api/services/devices.service';
import Swal from 'sweetalert2';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { DatePipe } from '@angular/common';
import { IAvgCalibrateProfile, ICalibrateItem, IGetLastCalibrateDetailResponse, IShowCollectCalibrateProfile } from 'src/app/api/models/calibrate_profile.model';
import { EnumCalibrateStatus } from './calibration';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { UsersService } from 'src/app/api/services/users.service';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { CalibrationStep, StateTesting } from 'src/app/models/common/state-testing';
import { CurrentStateTestingService } from 'src/app/api/services/current-state-testing.service';
import { chartBasicData, chartBasicOptions, chartResultBasicData, chartResultBasicOptions } from './chart';

@Component({
  selector: 'app-calibration',
  templateUrl: './calibration.component.html',
  styleUrls: ['./calibration.component.scss']
})
export class CalibrationComponent {
  calibrate_item!:ICalibrateItem;
  calibrate_item_avg!:IAvgCalibrateProfile;

  @Input() ConnectingStatus:EnumConnectionStatus = EnumConnectionStatus.Calibrate;
  @Output() modeEvent = new EventEmitter<Mode>();
  @Output() footerMessageEvent = new EventEmitter<string>();
  @Output() tempFooterMessageEvent = new EventEmitter<string>();

  isShowChart: boolean = false;
  isShowResultChart: boolean = false;
  calibrateStatus:EnumCalibrateStatus = EnumCalibrateStatus.Calibrate;

  calibrate_time: number = 0;
  calibrate_time_avg: number = 0;
  startCalibrateTime!: Date; 

  calibrateStep:CalibrationStep = CalibrationStep.StepStartCalibration;

  basicData: any = chartBasicData;
  basicOptions:any = chartBasicOptions;

  basicResultData: any = chartResultBasicData;
  basicResultOptions:any = chartResultBasicOptions;

  collectingData!: Observable<ISocketResponse>;

  constructor(private socketService:SocketService
              ,private devicesService:DevicesService
              ,private calibrateProfileService:CalibrateProfileService
              ,private usersService:UsersService
              ,private currentStateTestingService:CurrentStateTestingService) { }

  ngOnInit() : void {
    this.CheckCalibrationStep();
  }

  CheckCalibrationStep() : void{
    this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        switch(res?.device?.status)
        {
          // case EnumConnectionStatus.Cleaning:
          //   this.isShowChart = true;

          //   this.calibrateProfileService.ClearTempCalibration();
          //   this.calibrateProfileService.ClearTempCalibrationItem();
          //   this.GetSocketResponse();
          //   break;
          case EnumConnectionStatus.Stop:
            this.PlotLastCalibration();

            // const TempCalibration:any = this.calibrateProfileService.GetTempCalibration();
            // this.basicData = TempCalibration;
            
            // this.basicData = {...this.basicData};

            // const TempCalibrationItem:ICalibrateItem = this.calibrateProfileService.GetTempCalibrationItem();
            // this.calibrate_item = TempCalibrationItem;
            //this.GetSocketResponse();
            break;
          case EnumConnectionStatus.Calibrate:
          default:
            this.currentStateTestingService.SetCurrentStateTesting(StateTesting.Calibrate);

            this.isShowChart = true;

            this.calibrateProfileService.ClearTempCalibration();
            this.calibrateProfileService.ClearTempCalibrationItem();
            this.GetSocketResponse();
            break;
        }
      }
    });
  }

  GetSocketResponse() : void{
    this.socketService.getCalibrateRes().subscribe((res:ICalibrateSocketResponse) =>{
      //console.log("res",res);

      if(res.command == EnumSocketCommand.ShowCollectCalibrateData && res?.data)
      {
        if(this.calibrate_time == 0)
          this.startCalibrateTime = new Date();

        this.calibrate_item = res?.data?.calibrate_item;
        const data:ICalibrateItem = this.calibrate_item;

        const time:Date = new Date();
        
        this.basicData.labels.push(ToolUtils.FormatTimeMinute(time.toString()));
        this.calibrate_time = time.getTime() - this.startCalibrateTime.getTime() == 0 ? 1 : time.getTime() - this.startCalibrateTime.getTime()

        //const pressure = this.basicData.datasets.find((x:any) => x.label == 'Pressure').data;
        //const temp = this.basicData.datasets.find((x:any) => x.label == 'Temp').data;
        const gas_1 = this.basicData.datasets.find((x:any) => x.label == 'Gas 1').data;
        const gas_2 = this.basicData.datasets.find((x:any) => x.label == 'Gas 2').data;
        const gas_3 = this.basicData.datasets.find((x:any) => x.label == 'Gas 3').data;
        const gas_4 = this.basicData.datasets.find((x:any) => x.label == 'Gas 4').data;
        const gas_5 = this.basicData.datasets.find((x:any) => x.label == 'Gas 5').data;
        const gas_6 = this.basicData.datasets.find((x:any) => x.label == 'Gas 6').data;
        const gas_7 = this.basicData.datasets.find((x:any) => x.label == 'Gas 7').data;

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
    })
  }

  PlotLastCalibration() : void{
    this.isShowChart = false;
    this.isShowResultChart = true;
  
    this.calibrateProfileService.GetLastCalibrate().subscribe((res:IGetLastCalibrateDetailResponse) => {
      if(res?.success)
      {
        const data:IAvgCalibrateProfile = res.calibrate_profile;
        const startDate = new Date(data.created_at);
        const endDate = new Date(data.updated_at);

        this.calibrate_item_avg = data;
        this.calibrate_time_avg = (endDate.getTime() - startDate.getTime());

        this.basicResultData.datasets[0].data = [];
        
        this.basicResultData = {...this.basicResultData};

        this.basicResultData.datasets[0].data.push(data?.avg_gas_1);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_2);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_3);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_4);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_5);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_6);
        this.basicResultData.datasets[0].data.push(data?.avg_gas_7);
        
        this.basicResultData = {...this.basicResultData};
      }
      else{
        Swal.fire({
          title: `Error can't get last calibrate`,
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

  onClickStopCalibration() : void{
    this.calibrateProfileService.StopCalibrate().subscribe((res:IConnectResponse) => {
      if(res.success)
      {        
        //this.calibrateStatus = EnumCalibrateStatus.Finish;

        this.PlotLastCalibration();
        // this.calibrateProfileService.SetTempCalibration(this.basicData);
        // this.calibrateProfileService.SetTempCalibrationItem(this.calibrate_item);
        
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
    });
  }

  onClickFinishProcess():void{
    //test
    // AuthUtils.ClearStateStatus();
    // AuthUtils.ClearStateClibration();

    // this.modeEvent.emit(Mode.Cleaning);

    this.calibrateProfileService.EndCalibrate().subscribe((res:IConnectResponse) => {
      if(res.success)
      {        
        // AuthUtils.ClearStateStatus();
        // AuthUtils.ClearStateClibration();
        this.calibrateProfileService.ClearTempCalibration();
        this.modeEvent.emit(Mode.Cleaning);

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
    });
  }

  public get CalibrateStatus(): typeof EnumCalibrateStatus{
    return EnumCalibrateStatus;
  }

  public get EnumConnectionStatus(): typeof EnumConnectionStatus {
    return EnumConnectionStatus; 
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
