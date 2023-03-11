import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { ICollectingData, ITestItem } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { ISocketResponse } from 'src/app/api/models/socket.mode';
import { SocketService } from 'src/app/api/services/socket.service';
import { Socket } from 'ngx-socket-io';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import { TestsService } from 'src/app/api/services/tests.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { CurrentStateTestingService } from 'src/app/api/services/current-state-testing.service';
import { StateTesting } from 'src/app/models/common/state-testing';
import { chartBasicData, chartBasicOptions, chartResultBasicData, chartResultBasicOptions } from './chart';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { UsersService } from 'src/app/api/services/users.service';
import { IDifCalibrate, IItem, ITestDetailResponse } from 'src/app/api/models/test.model';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { IAvgCalibrateProfile, IGetLastCalibrateDetailResponse } from 'src/app/api/models/calibrate_profile.model';

@Component({
  selector: 'app-collecting-data',
  templateUrl: './collecting-data.component.html',
  styleUrls: ['./collecting-data.component.scss']
})
export class CollectingDataComponent {
  //@Input() isProcess:boolean = true;
  isProcess:boolean = true;
  @Input() ConnectingStatus:EnumConnectionStatus = EnumConnectionStatus.Processing;
  @Output() modeEvent = new EventEmitter<Mode>();
  @Output() testIdEvent = new EventEmitter<string>();
  @Output() isFinishedEvent = new EventEmitter<boolean>();

  isFinished:boolean = false;
  displayModalResult:boolean = false;

  url:string = ToolUtils.FormatUrl("result?id="+this.testsService.GetCurrentTestingId().toString());
  
  testId:number = 0;
  isCopiedToClipboard:boolean = false;

  basicData: any = chartBasicData;
  basicOptions:any = chartBasicOptions;

  resultBasicData: any = chartResultBasicData;
  resultBasicOptions:any = chartResultBasicOptions;

  avgCalibrateData!:IAvgCalibrateProfile;

  collectingData!: Observable<ISocketResponse>;
  tempData:number = 0;
  pressureData:number = 0;

  avgTempData:number = 0;
  avgPressureData:number = 0;

  constructor(private socketService:SocketService
              ,private testsService:TestsService
              ,private calibrateProfileService:CalibrateProfileService
              ,private currentStateTestingService:CurrentStateTestingService
              ,private usersService:UsersService) { }

  ngOnInit() : void {        
    this.CheckCollectingDataStep();
  }
  
  CheckCollectingDataStep() : void{
    this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        if(this.ConnectingStatus == EnumConnectionStatus.Stop
          || this.ConnectingStatus == EnumConnectionStatus.Cleaning){
          this.PlotLastCollectingData();
        }
        else if(this.ConnectingStatus == EnumConnectionStatus.PreCollecting
          || this.ConnectingStatus == EnumConnectionStatus.Processing){
    
          this.currentStateTestingService.SetCurrentStateTesting(StateTesting.StartProcessCollectingData);
    
          this.calibrateProfileService.GetLastCalibrate().subscribe((res:IGetLastCalibrateDetailResponse) => {
            if(res?.success)
            {
              const calibrateData:IAvgCalibrateProfile = res.calibrate_profile;

              this.socketService.getNewRes().subscribe((res:ISocketResponse) =>{
                if(res.command == EnumSocketCommand.ShowCollectData && res?.data?.test_item)
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
          
                  this.testId = res.data.test_item.test_id;
                  this.testsService.SetCurrentTestingId(this.testId);
          
                  const routeUrl = "result?id="+this.testsService.GetCurrentTestingId();
                  this.url = ToolUtils.FormatUrl(routeUrl);
                  
                  this.tempData = Math.round((data?.temp - calibrateData.avg_temp) * 100) / 100;
                  this.pressureData = Math.round((data?.pressure - calibrateData.avg_pressure) * 100) / 100;
          
                  console.log("gas1",data?.gas_1);
                  console.log("avg calibrate",calibrateData.avg_gas_1);
                  console.log("plot gas1",data?.gas_1 - calibrateData.avg_gas_1);
                  if(this.basicData.labels.length <= 30)
                  {
                    //pressure.push(data?.pressure);
                    //temp.push(data?.temp);
                    gas_1.push(data?.gas_1 - calibrateData.avg_gas_1);
                    gas_2.push(data?.gas_2 - calibrateData.avg_gas_2);
                    gas_3.push(data?.gas_3 - calibrateData.avg_gas_3);
                    gas_4.push(data?.gas_4 - calibrateData.avg_gas_4);
                    gas_5.push(data?.gas_5 - calibrateData.avg_gas_5);
                    gas_6.push(data?.gas_6 - calibrateData.avg_gas_6);
                    gas_7.push(data?.gas_7 - calibrateData.avg_gas_7);
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
                    gas_1.push(data?.gas_1 - calibrateData.avg_gas_1);
                    gas_2.push(data?.gas_2 - calibrateData.avg_gas_2);
                    gas_3.push(data?.gas_3 - calibrateData.avg_gas_3);
                    gas_4.push(data?.gas_4 - calibrateData.avg_gas_4);
                    gas_5.push(data?.gas_5 - calibrateData.avg_gas_5);
                    gas_6.push(data?.gas_6 - calibrateData.avg_gas_6);
                    gas_7.push(data?.gas_7 - calibrateData.avg_gas_7);
                  }
                }
          
                this.basicData = {...this.basicData};
              });
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
      }
    });
  }
  
  PlotLastCollectingData() : void{
    this.testsService.GetTestDetail(this.testsService.GetCurrentTestingId()).subscribe((res:ITestDetailResponse) =>{
      if(res?.success)
      {
        const data:IDifCalibrate[] = res.test.test_item_dif_calibrates;
      
        //const pressure = this.basicData.datasets.find((x:any) => x.label == 'Pressure').data;
        //const temp = this.basicData.datasets.find((x:any) => x.label == 'Temp').data;
        const gas_1 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 1').data;
        const gas_2 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 2').data;
        const gas_3 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 3').data;
        const gas_4 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 4').data;
        const gas_5 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 5').data;
        const gas_6 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 6').data;
        const gas_7 = this.resultBasicData.datasets.find((x:any) => x.label == 'Gas 7').data;

        let arrTemps:number[] = [];
        let arrPresures:number[] = [];

        const currentDate = new Date();

        data.forEach((item:IDifCalibrate) => {
            this.resultBasicData.labels.push("");

            // arrTemps.push(item?.temp - calibrateData?.avg_temp);
            // arrPresures.push(item?.pressure - calibrateData?.avg_pressure);
            // gas_1.push(item?.gas_1 - calibrateData?.avg_gas_1);
            // gas_2.push(item?.gas_2 - calibrateData?.avg_gas_2);
            // gas_3.push(item?.gas_3 - calibrateData?.avg_gas_3);
            // gas_4.push(item?.gas_4 - calibrateData?.avg_gas_4);
            // gas_5.push(item?.gas_5 - calibrateData?.avg_gas_5);
            // gas_6.push(item?.gas_6 - calibrateData?.avg_gas_6);
            // gas_7.push(item?.gas_7 - calibrateData?.avg_gas_7);
            
            arrTemps.push(item?.temp);
            arrPresures.push(item?.pressure);
            gas_1.push(item?.gas_1);
            gas_2.push(item?.gas_2);
            gas_3.push(item?.gas_3);
            gas_4.push(item?.gas_4);
            gas_5.push(item?.gas_5);
            gas_6.push(item?.gas_6);
            gas_7.push(item?.gas_7);
        });

        this.avgTempData = Math.round(arrTemps.reduce((a,b) => a+b,0) * 100) / 100;
        this.avgPressureData = Math.round(arrPresures.reduce((a,b) => a+b,0) * 100) / 100;

        this.resultBasicData = {...this.resultBasicData};
      }
      else{
        Swal.fire({
          title: `Error can't get last collecting data`,
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
    
  onClickStopCollectingData() : void{
    const testId = this.testsService.GetCurrentTestingId();

    this.testsService.StopTest(testId).subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        //this.isProcess = false;

        //this.testsService.SetTempTesting(this.basicData);
        this.PlotLastCollectingData();
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
    const testId = this.testsService.GetCurrentTestingId();

    this.testsService.EndTest(testId).subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.displayModalResult = true;
        //this.isFinishedEvent.emit(true);
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

  onClickClipboard() : void{
    document.addEventListener('copy', (e: ClipboardEvent) => {
      if(e.clipboardData)
      {
        e.clipboardData.setData('text/plain', (this.url));
        e.preventDefault();
        //document.removeEventListener('copy', null);

        this.isCopiedToClipboard = true;

        let timer: ReturnType<typeof setTimeout> = setTimeout(() => { 
          clearTimeout(timer);

          this.isCopiedToClipboard = false;
         }, 5*1000);

      }
    });
    document.execCommand('copy');
  }

  onClickShowResult() :void{
    this.displayModalResult = true;
  }

  public get EnumConnectionStatus(): typeof EnumConnectionStatus {
    return EnumConnectionStatus; 
  }

  public get Mode(): typeof Mode {
    return Mode; 
  }
}
