import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { State } from 'nats.ws/lib/nats-base-client/parser';
import { IAvgCalibrateProfile, IGetLastCalibrateDetailResponse } from 'src/app/api/models/calibrate_profile.model';
import { ICaseDetail, IGetListCasesResponse } from 'src/app/api/models/case.model';
import { IStatus } from 'src/app/api/models/data.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { IStatusSocketResponse } from 'src/app/api/models/socket.mode';
import { IStartPreTestRequest } from 'src/app/api/models/test.model';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { CasesService } from 'src/app/api/services/cases.service';
import { DevicesService } from 'src/app/api/services/devices.service';
import { SocketService } from 'src/app/api/services/socket.service';
import { TestsService } from 'src/app/api/services/tests.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
import Swal from 'sweetalert2';
import { Mode, StateCalibration } from './testing';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {
  containerModule = document.querySelector<HTMLElement>('.parent');
  mouseDown = false;
  startX: any;
  scrollLeft: any;
  isShowMenu:boolean = true;
  mode:Mode = Mode.Menu;
  displayModal:boolean = false;
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

  isProcess:boolean = false;
  isFinished:boolean = false;

  footerMessage:string = "";

  basicData: any = {
    labels: ["Avg Gas 1","Avg Gas 2","Avg Gas 3","Avg Gas 4","Avg Gas 5","Avg Gas 6","Avg Gas 7"],
    datasets: [
      {
        label: "calibrate",
        data: [],
        fill: false,
        borderColor: '#ffed4a',
        tension: 0,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(201, 203, 207, 0.8)'
        ],
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
          },
          display: false
      },
      title: {
        display: false,
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
            //max: 3000,
        }
    },
    indexAxis: 'y',
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
    //clip: {left: false, top: false, right: 1000, bottom: false},
    //pointBorderWidth:5,
    //pointHoverBorderWidth:10
  };

  constructor(private router:Router
              ,private socketService:SocketService
              ,private usersService:UsersService
              ,private devicesService:DevicesService
              ,private casesService:CasesService
              ,private calibrateProfileService:CalibrateProfileService
              ,private testsService:TestsService) { }

  ngOnInit() : void {
    //Socket
    this.CheckChangeStatus();

    //One time
    this.CheckMode();
    this.CheckConnectedDevice();
    this.CheckIDCard();
    this.CheckCalibrateProfile();
    this.CheckStateCalibrate();
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

  CheckChangeStatus() : void{
    //this.footerMessage = AuthUtils.GetCurrentStateStatus();

    this.socketService.getStatus().subscribe((res:IStatusSocketResponse) => {
      //console.log("Get status",res);
      
      if(res?.data)
      {
        if(res?.command == EnumSocketCommand.ChangeStatus)
        {
          const status:EnumConnectionStatus = <EnumConnectionStatus>res.data.status;

          switch(status)
          {
            case EnumConnectionStatus.PreCalibrate:
              this.displayModalPreCalibration = false;
              break;
            case EnumConnectionStatus.Cleaning:
              this.displayModalCleaning = true;

              this.waitToMenu = true;
              break;
            case EnumConnectionStatus.StopTest:
              break;
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

              this.displayModalCleaning = false;
              this.displayModalStopTest = false;

              if(this.waitToMenu)
              {
                AuthUtils.ClearStateStatus();
                AuthUtils.ClearStateClibration();
                this.CheckStateCalibrate();      

                this.waitToMenu = false;
              }

              break;
          }

          this.changeFooterMessage(res?.data?.status);
          this.CheckCalibrateProfile();
        }
      }
    });
  }

  async CheckConnectedDevice(): Promise<IGetConnectedDeviceResponse>{
    await this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        //console.log("Conencted Device",res);

        AuthUtils.SetCurrentDevice(res.device);
        this.currentDevice =  AuthUtils.GetCurrentDevice();

        //check status

        switch(res?.device?.status)
        {
          case EnumConnectionStatus.StartPreProcessing:
            this.mode = Mode.StartPreProcessing;
            break;  
          case EnumConnectionStatus.EndPreProcessing:
            this.mode = Mode.EndPreProcessing;
            break;  
          case EnumConnectionStatus.Ready:
            this.mode = Mode.Menu;
            break;
          case EnumConnectionStatus.Cleaning:
            this.displayModalCleaning = true;
            break;
          case EnumConnectionStatus.PreProcessing:
          case EnumConnectionStatus.Processing:
            this.mode = Mode.CollectingData;
            this.isProcess = true;
            break;
        }

        this.changeFooterMessage(res?.device?.status);

        return <IGetConnectedDeviceResponse>{
          success:res?.success,
          message:res?.message,
          device:res?.device,
          case:res?.case,
        }
      }
      else
      {
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
          success:res?.success,
          message:res?.message
        }
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
        this.lastCalibrateDate = ToolUtils.FormatDate(this.lastCalibrateProfile?.calibrate_profile.created_at);

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
    this.footerMessage = message.toUpperCase();
    //AuthUtils.SetCurrentStateStatus(this.footerMessage);
  }

  changeTempFooterMessage(message:string){
    this.footerMessage = message;
  }

  onClickCheckDeviceInit(){
    if(this.devicesService.IsConnected())
    {
      this.devicesService.CommandTest().subscribe((res:IConnectResponse) => {
        if(res?.success)
        {
          this.mode = Mode.CheckInit;
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
    this.displayModalPreCalibration = true;

    this.calibrateProfileService.PreStartCalibrate().subscribe((res:IConnectResponse) =>{
      if(res?.success)
      {
        this.currentStateCalibration = StateCalibration.StartCalibration;
        AuthUtils.SetCurrentStateCalibration(this.currentStateCalibration);
      }
      else{
        this.displayModalPreCalibration = false;

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

  onClickBack(): void{
    switch(this.mode){
      case Mode.Calibration:
        this.mode = Mode.Menu;
        break;
      case Mode.StartPreProcessing:
      case Mode.EndPreProcessing:
      case Mode.CheckInit:
      case Mode.Cleaning:
      case Mode.CollectingData:
      default:
        this.mode = Mode.Menu;
        break;
    }
  }

  onClickOpenModalIDCards(): void{
    this.displayModal = true;

    this.GetListIDCards();
  }

  GetListIDCards() : void{
    this.IsDialogLoading = true;

    this.casesService.GetListCases(this.keywordSearchIDCard).subscribe((res:IGetListCasesResponse) => {
      if(res?.success)
      {
        this.IsDialogLoading = false;

        this.IDCards = res.cases;
        console.log("this.IDCards",this.IDCards);
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

  onClickSelectIDCard(id:number): void{
    const selectedIDCard = <ICaseDetail>this.IDCards.find(x => x.id = id)

    if(selectedIDCard){
      this.currentIDCard = selectedIDCard
      AuthUtils.SetCurrentIDCard(this.currentIDCard);

      this.displayModal = false;
    }
    else{
    }
  }

  onClickCreateIDCard(): void{

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

  public get Mode(): typeof Mode {
    return Mode; 
  }

  public FormatDate(date:string){
    return ToolUtils.FormatDate(date);
  }

  public FormatTime(date:string){
    return ToolUtils.FormatTime(date);
  }
}
