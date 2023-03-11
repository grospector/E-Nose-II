import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { State } from 'nats.ws/lib/nats-base-client/parser';
import { Observable } from 'rxjs';
import { IAvgCalibrateProfile, IGetLastCalibrateDetailResponse } from 'src/app/api/models/calibrate_profile.model';
import { ICaseDetail, IGetListCasesResponse } from 'src/app/api/models/case.model';
import { IStatus } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { IStatusSocketResponse } from 'src/app/api/models/socket.mode';
import { IStartPreTestRequest } from 'src/app/api/models/test.model';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { CasesService } from 'src/app/api/services/cases.service';
import { CurrentStateTestingService } from 'src/app/api/services/current-state-testing.service';
import { DevicesService } from 'src/app/api/services/devices.service';
import { SocketService } from 'src/app/api/services/socket.service';
import { TestsService } from 'src/app/api/services/tests.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
import { CalibrationStep, CheckDeviceInitStep, StartProcessCollectingDataStep, StateTesting } from 'src/app/models/common/state-testing';

import Swal from 'sweetalert2';
import { chartBasicData, chartBasicOptions } from './chart';
import { Mode, StateCalibration } from './testing';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  mouseDown = false;
  startX: any;
  scrollLeft: any;
  isShowMenu:boolean = true;
  mode:Mode = Mode.Menu;
  displayModal:boolean = false;
  displayModalCreateIDCard:boolean = false;
  displayModalStopTest:boolean = false;
  displayModalCalibrate:boolean = false;
  displayModalPreCalibration:boolean = false;
  displayModalCleaning:boolean = false;
  displayModalResult:boolean = false;

  waitToMenu:boolean = false;

  IsDialogLoading:boolean = true;
  IDCards:ICaseDetail[] = [];
  keywordSearchIDCard:string = "";
  currentIDCard!:ICaseDetail;
  currentDevice!:IDevice;
  lastCalibrateDate:string = "";
  lastCalibrateProfile!:IGetLastCalibrateDetailResponse;
  currentStateCalibration!:StateCalibration;
  isStepPreCalibrate:boolean = false;

  connectingStatus!:EnumConnectionStatus;
  checkDeviceInitStep:CheckDeviceInitStep = CheckDeviceInitStep.StepTest;
  calibrationStep:CalibrationStep = CalibrationStep.StepPreCalibration;
  startProcessCollectingDataStep:StartProcessCollectingDataStep = StartProcessCollectingDataStep.StepStartPreProcessing;

  isProcess:boolean = false;
  isFinished:boolean = false;

  currentStateTesting:StateTesting = StateTesting.Menu;
  currentStatus:string = "";
  footerMessage:string = "";

  inputIdCard:string = "";
  inputName:string = "";
  inputPhoneNumber:string = "";

  basicData: any = chartBasicData;
  basicOptions:any = chartBasicOptions;

  constructor(private router:Router
              ,private socketService:SocketService
              ,private usersService:UsersService
              ,private devicesService:DevicesService
              ,private casesService:CasesService
              ,private calibrateProfileService:CalibrateProfileService
              ,private testsService:TestsService
              ,private currentStateTestingService:CurrentStateTestingService) { }

  ngOnInit() : void {
    //Socket
    this.CheckChangeStatus();

    //One time
    //this.CheckMode();
    this.CheckConnectedDevice();
    this.CheckIDCard();
    this.CheckCalibrateProfile();
    this.CheckCurrentStateTesting();
    //this.CheckStateCalibrate();
  }

  CheckMode(): void{
    switch(this.mode)
    {
      case Mode.StopTest:
        this.displayModalStopTest = true;

        this.changeMode(Mode.Menu);
        break;
      case Mode.Cleaning:
        this.displayModalCleaning = true;
        this.waitToMenu = true;

        break;
      case Mode.StartPreProcessing:
        break;
      case Mode.EndPreProcessing:
        break;
    }
  }

  CheckCurrentStateTesting() : void{
    this.currentStateTesting = this.currentStateTestingService.GetCurrentStateTesting() as StateTesting;

    switch(+this.currentStateTesting)
    {
      case StateTesting.CheckDeviceInit:
        this.mode = Mode.CheckInit;
        break;
      case StateTesting.Calibrate:
        this.mode = Mode.Calibration;
        break;
      case StateTesting.StartProcessCollectingData:
        this.mode = Mode.CollectingData;
        break;
      case StateTesting.Cleaning:
        this.displayModalCleaning = true;
        break;
      case StateTesting.Menu:
        this.displayModalCleaning = false;
        this.mode = Mode.Menu;
        break;
      default:
        break;
    }
  }

  CheckChangeStatus() : void{
    //this.footerMessage = AuthUtils.GetCurrentStateStatus();

    this.socketService.getStatus().subscribe((res:IStatusSocketResponse) => {
      //console.log("Get status",res);
      
      if(res?.data)
      {
        if(res?.command == EnumSocketCommand.ChangeStatus)
        {
          const status:EnumConnectionStatus = <EnumConnectionStatus>res.data.status;
          this.currentStatus = res.data.status;

          this.isStepPreCalibrate = false;

          // case EnumConnectionStatus.StopTest:
          //   this.mode = Mode.CheckInit;
          //   this.checkDeviceInitStep = CheckDeviceInitStep.StepStopTesting;
          //   break;
          // case EnumConnectionStatus.Stop:
          //     this.mode = Mode.Calibration;
          //     this.calibrationStep = CalibrationStep.StepStopCalibration
          //     break;
          this.connectingStatus = status as EnumConnectionStatus;
          switch(status)
          {
            case EnumConnectionStatus.Cleaning:
              this.displayModalCleaning = true;

              this.waitToMenu = true;
              break;
            case EnumConnectionStatus.Test:
              this.mode = Mode.CheckInit;
              this.checkDeviceInitStep = CheckDeviceInitStep.StepTest;
              break;
            case EnumConnectionStatus.PreCalibrate:
              this.displayModalPreCalibration = false;
              this.isStepPreCalibrate = true;
              this.calibrationStep = CalibrationStep.StepPreCalibration
              break;
            case EnumConnectionStatus.Calibrate:
              this.mode = Mode.Calibration;
              this.calibrationStep = CalibrationStep.StepStartCalibration
              break;
            case EnumConnectionStatus.PreProcessing:
            case EnumConnectionStatus.StartPreProcessing:
              this.mode = Mode.StartPreProcessing;
              break;  
            case EnumConnectionStatus.EndPreProcessing:
              this.mode = Mode.EndPreProcessing;
              break;
            case EnumConnectionStatus.PreProcessing:
            case EnumConnectionStatus.Processing:
              this.mode = Mode.CollectingData;
              break;
            case EnumConnectionStatus.Ready:
              this.mode = Mode.Menu;

              this.currentStateTestingService.ClearCurrentStateTesting();
              this.testsService.ClearTempTesting();
              this.calibrateProfileService.ClearTempCalibration();
              this.calibrateProfileService.ClearTempCalibrationItem();
              this.testsService.ClearCurrentTestingId();

              this.displayModalCleaning = false;
              this.displayModalStopTest = false;

              if(this.waitToMenu)
              {
                //AuthUtils.ClearStateStatus();
                //AuthUtils.ClearStateClibration();
                //this.CheckStateCalibrate();      

                this.waitToMenu = false;
              }

              break;
          }

          //this.store.dispatch(this.mode);

          this.changeFooterMessage(res?.data?.status);
          //this.CheckCalibrateProfile();
        }
      }
    });
  }

  async CheckConnectedDevice(): Promise<IGetConnectedDeviceResponse>{
    this.usersService.GetConnectedDeviceDetail().subscribe((res: IGetConnectedDeviceResponse) => {
      if (res?.success) {
        //console.log("Conencted Device",res);
        AuthUtils.SetCurrentDevice(res.device);
        this.currentDevice = AuthUtils.GetCurrentDevice();

        this.connectingStatus = res?.device?.status as EnumConnectionStatus;
        //check status
        // case EnumConnectionStatus.StopTest:
        //   this.mode = Mode.CheckInit;
        //   this.checkDeviceInitStep = CheckDeviceInitStep.StepStopTesting;
        //   break;
        // case EnumConnectionStatus.Stop:
        //   this.mode = Mode.Calibration;
        //   this.calibrationStep = CalibrationStep.StepStopCalibration;
        //   break;
        
        switch (this.connectingStatus) {
          case EnumConnectionStatus.Ready:
            this.mode = Mode.Menu;

            this.currentStateTestingService.ClearCurrentStateTesting();
            this.testsService.ClearTempTesting();
            this.calibrateProfileService.ClearTempCalibration();
            this.calibrateProfileService.ClearTempCalibrationItem();
            this.testsService.ClearCurrentTestingId();
            break;
          case EnumConnectionStatus.Cleaning:
            this.displayModalCleaning = true;
            break;
          case EnumConnectionStatus.Test:
            this.mode = Mode.CheckInit;
            this.checkDeviceInitStep = CheckDeviceInitStep.StepTest;
            break;
          case EnumConnectionStatus.PreCalibrate:
            this.isStepPreCalibrate = true;
            //this.calibrationStep = CalibrationStep.StepPreCalibration;
            break;
          case EnumConnectionStatus.Calibrate:
            this.mode = Mode.Calibration;
            this.calibrationStep = CalibrationStep.StepStartCalibration;
            break;
          case EnumConnectionStatus.PreProcessing:
            this.mode = Mode.StartPreProcessing;
            this.startProcessCollectingDataStep = StartProcessCollectingDataStep.StepStartPreProcessing;
            break;
          case EnumConnectionStatus.StartPreProcessing:
            this.mode = Mode.StartPreProcessing;
            this.startProcessCollectingDataStep = StartProcessCollectingDataStep.StepStartPreProcessing;
            break;
          case EnumConnectionStatus.EndPreProcessing:
            this.mode = Mode.EndPreProcessing;
            this.startProcessCollectingDataStep = StartProcessCollectingDataStep.StepEndPreProcessing;
            break;
          case EnumConnectionStatus.PreCollecting:
          case EnumConnectionStatus.Processing:
            this.mode = Mode.CollectingData;
            this.startProcessCollectingDataStep = StartProcessCollectingDataStep.StepProcessing;
            this.isProcess = true;
            break;
        }

        this.currentStatus = res?.device?.status;
        this.changeFooterMessage(res?.device?.status);

        return <IGetConnectedDeviceResponse>{
          success: res?.success,
          message: res?.message,
          device: res?.device,
          case: res?.case,
        };
      }

      else {
        Swal.fire({
          title: `Device status isn't ready.`,
          text: '',
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );

        return <IGetConnectedDeviceResponse>{
          success: res?.success,
          message: res?.message
        };
      }
    });

    
    return <IGetConnectedDeviceResponse>{
      success:false,
      message:"Get Connect Device don't response"
    }
  }

  async CheckIDCard():Promise<boolean>{
    const currentIDCard = AuthUtils.GetCurrentIDCard();
    if(currentIDCard)
    {
      this.currentIDCard = currentIDCard;

      return true;
    }
    else{
      return false;
    }
  }

  
  async CheckCalibrateProfile():Promise<IGetLastCalibrateDetailResponse>{
    this.calibrateProfileService.GetLastCalibrate().subscribe((res:IGetLastCalibrateDetailResponse) => {
      if(res?.success)
      {
        this.lastCalibrateProfile = res;
        this.lastCalibrateDate = ToolUtils.FormatFullDate(this.lastCalibrateProfile?.calibrate_profile.created_at);

        const data:IAvgCalibrateProfile = res.calibrate_profile;

        this.basicData.datasets[0].data = [];

        this.basicData = {...this.basicData};

        this.basicData.datasets[0].data.push(data?.avg_gas_1);
        this.basicData.datasets[0].data.push(data?.avg_gas_2);
        this.basicData.datasets[0].data.push(data?.avg_gas_3);
        this.basicData.datasets[0].data.push(data?.avg_gas_4);
        this.basicData.datasets[0].data.push(data?.avg_gas_5);
        this.basicData.datasets[0].data.push(data?.avg_gas_6);
        this.basicData.datasets[0].data.push(data?.avg_gas_7);
        
        this.basicData = {...this.basicData};

        return <IGetLastCalibrateDetailResponse>{
          success:res?.success,
          message:res?.message,
        }
      }
      else{

        return <IGetLastCalibrateDetailResponse>{
          success:res?.success,
          message:res?.message
        }
      }
    });

    
    return <IGetLastCalibrateDetailResponse>{
      success:false,
      message:"Get Connect Device don't response"
    }
  }

  CheckStateCalibrate() : void{
    this.currentStateCalibration = AuthUtils.GetCurrentStateCalibration();
  }

  startLoadingCleaning() : void{

  }
  stopLoadingCleaning() : void{

  }

  startLoading() : void{

  }
  stopLoading() : void{

  }
  
  startLoadingPreCalibrate() : void{

  }
  stopLoadingPreCalibrate() : void{

  }

  startDragging(e:any, flag:any, el:any) {
    this.mouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }
  stopDragging(e:any, flag:any) {
    this.mouseDown = false;
  }
  moveEvent(e:any, el:any) {
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    console.log(e);
    const x = e.pageX - el.offsetLeft;
    const scroll = x - this.startX;
    el.scrollLeft = this.scrollLeft - scroll;
  }

  changeMode(mode:Mode){
    this.mode = mode;
    this.CheckMode();
  }

  changeFooterMessage(message:string){
    this.footerMessage = message?.toUpperCase();
    //AuthUtils.SetCurrentStateStatus(this.footerMessage);
  }

  onClickCheckDeviceInit(){
    if(this.devicesService.IsConnected())
    {
      this.devicesService.CommandTest().subscribe((res:IConnectResponse) => {
        if(res?.success)
        {
          this.mode = Mode.CheckInit;
          this.currentStateTestingService.SetCurrentStateTesting(StateTesting.CheckDeviceInit);
        }
        else{
          Swal.fire({
            title: `Error command_test`,
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
    else{
      Swal.fire({
        title: `Error device is't connected`,
        text: '',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'OK'
      }).then(
        (result) => {
        }
      );
    }
  }

  
  onClickCalibration(){
    this.calibrateProfileService.PreStartCalibrate().subscribe((res:IConnectResponse) =>{
      if(res?.success)
      {
        this.displayModalPreCalibration = true;
        this.isStepPreCalibrate = true;
      }
      else{
        this.displayModalPreCalibration = false;
        this.isStepPreCalibrate = false;

        Swal.fire({
          title: `Error!!! Pre Start Calibrate`,
          text: "",
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    //   let timer: ReturnType<typeof setTimeout> = setTimeout(() => { 
    //     clearTimeout(timer);
        
    //     if(res?.success)
    //     {
    //       this.displayModalPreCalibration = false;
    //       this.currentStateCalibration = StateCalibration.StartCalibration;
    //       AuthUtils.SetCurrentStateCalibration(this.currentStateCalibration);

    //     }
    //     else{
    //       this.displayModalPreCalibration = false;

    //       Swal.fire({
    //         title: `Error!!! Pre Start Calibrate`,
    //         text: "",
    //         icon: 'error',
    //         showCancelButton: true,
    //         confirmButtonText: 'OK'
    //       }).then(
    //         (result) => {
    //         }
    //       );
    //     }
    //  },5*1000);
    });
  }

  onClickStartCalibration(){
    //test
    //this.mode = Mode.Calibration;

    this.calibrateProfileService.StartCalibrate().subscribe((res:IGetLastCalibrateDetailResponse) =>{
      if(res?.success){
        this.mode = Mode.Calibration;

        this.lastCalibrateProfile = res;
        this.lastCalibrateDate = ToolUtils.FormatDate(this.lastCalibrateProfile?.calibrate_profile?.created_at);
     
        const data:IAvgCalibrateProfile = res.calibrate_profile;

        this.basicData.datasets[0].data = [];
        
        this.basicData = {...this.basicData};

        this.basicData.datasets[0].data.push(data?.avg_gas_1);
        this.basicData.datasets[0].data.push(data?.avg_gas_2);
        this.basicData.datasets[0].data.push(data?.avg_gas_3);
        this.basicData.datasets[0].data.push(data?.avg_gas_4);
        this.basicData.datasets[0].data.push(data?.avg_gas_5);
        this.basicData.datasets[0].data.push(data?.avg_gas_6);
        this.basicData.datasets[0].data.push(data?.avg_gas_7);
        
        this.basicData = {...this.basicData};
      }
      else{
        Swal.fire({
          title: `Error!!! Start Calibrate`,
          text: "",
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
  
  onClickCleaning(){
    this.devicesService.CommandCleaning().subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.displayModalCleaning = true;
        this.currentStateTestingService.SetCurrentStateTesting(StateTesting.Cleaning);
      }
      else{
        Swal.fire({
          title: `Error device can't clean`,
          text: '',
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

  onClickStartProcessCollectingData(){
    if(!AuthUtils.GetCurrentIDCard())
    {
      Swal.fire({
        title: `ID Card isn't selected`,
        text: "Please , Select ID card before start process collecting data",
        icon: 'info',
        confirmButtonText: 'OK'
      }).then(
        (result) => {
        }
      );

      return;
    }

    const startPreTestRequest:IStartPreTestRequest = <IStartPreTestRequest>{
      case_id : AuthUtils.GetCurrentIDCard().id,
      name : AuthUtils.GetCurrentIDCard().name,
      note : ""
    };
    
    this.testsService.StartPreTest(startPreTestRequest).subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.changeMode(Mode.StartPreProcessing);
      }
      else{
        Swal.fire({
          title: `Error!!! can't start process collecting data`,
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

  onClickHome(): void{
    this.router.navigateByUrl('/');
  }

  async onClickOpenModalIDCards(): Promise<void>{
    await this.CheckConnectedDevice();

    if(this.connectingStatus == EnumConnectionStatus.Ready)
    {
      this.displayModal = true;

      this.GetListIDCards();
    }
  }

  GetListIDCards() : void{
    this.IsDialogLoading = true;

    this.casesService.GetListCases(this.keywordSearchIDCard).subscribe((res:IGetListCasesResponse) => {
      if(res?.success)
      {
        this.IsDialogLoading = false;

        this.IDCards = res.cases;
        //console.log("this.IDCards",this.IDCards);
      }
      else{

        this.IsDialogLoading = false;
        Swal.fire({
          title: `Error!!! fetch list cases`,
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

  onClickSelectIDCard(idCard:string): void{
    if(this.connectingStatus != EnumConnectionStatus.Ready)
    {
      Swal.fire({
        title: `Warning device status don't ready`,
        text: "Please , try again when device status is ready",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK'
      }).then(
        (result) => {
        }
      );

      return;
    }

    const selectedIDCard:ICaseDetail = <ICaseDetail>this.IDCards.find((obj) => {
      return obj.id_card === idCard
    });

    if(selectedIDCard){
      this.currentIDCard = selectedIDCard
      AuthUtils.SetCurrentIDCard(this.currentIDCard);

      this.displayModal = false;
    }
    else{
    }
  }

  onClickCreateIDCard(): void{
    this.displayModal = false;
    this.displayModalCreateIDCard = true;
  }

  onClickCalibrateDate(): void{
    if(this.lastCalibrateProfile)
    {
      this.displayModalCalibrate = true;
    }
    else {
      this.displayModalCalibrate = false;
    }
  }

  ChangeFinished(isFinished:boolean) : void{
    this.isFinished = isFinished;
  }

  createIDCard(): void{
    if(this.inputIdCard == "" 
      || this.inputName == ""
      || this.inputPhoneNumber == "")
    {
      Swal.fire({
        title: `Warning`,
        text: "ID Card , Name or Phone number is empty.",
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(
        (result) => {
        }
      );

      return;
    }

    const currentIDCard:ICaseDetail = <ICaseDetail> {
      id_card : this.inputIdCard,
      name : this.inputName,
      phone_number : this.inputPhoneNumber
    };

    this.casesService.CreateCase(currentIDCard).subscribe((res:IConnectResponse) =>{
      if(res?.success)
      {
        this.currentIDCard = currentIDCard;
        AuthUtils.SetCurrentIDCard(currentIDCard);
        
        Swal.fire({
          title: `ID Card : ${currentIDCard.id_card} is created`,
          text: `Name : ${currentIDCard.name} , Phone Number : ${currentIDCard.phone_number} `,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
            this.displayModalCreateIDCard = false;
          }
        );
      }
      else{
        Swal.fire({
          title: `Error Create ID Card`,
          text: res?.message,
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

  public get EnumConnectionStatus(): typeof EnumConnectionStatus {
    return EnumConnectionStatus; 
  }
  
  public FormatDate(date:string){
    return ToolUtils.FormatDate(date);
  }

  public FormatTime(date:string){
    return ToolUtils.FormatTime(date);
  }
}
