import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICalibrateProfile, IGetLastCalibrateDetailResponse } from 'src/app/api/models/calibrate_profile.model';
import { ICaseDetail, IGetListCasesResponse } from 'src/app/api/models/case.model';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { CalibrateProfileService } from 'src/app/api/services/calibrate-profile.service';
import { CasesService } from 'src/app/api/services/cases.service';
import { DevicesService } from 'src/app/api/services/devices.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { ToolUtils } from 'src/app/core/common/tool.utils';
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
  displayModalCalibrate:boolean = false;

  IsDialogLoading:boolean = true;
  IDCards:ICaseDetail[] = [];
  keywordSearchIDCard:string = "";
  currentIDCard!:ICaseDetail;
  currentDevice!:IDevice;
  lastCalibrateDate:string = "";
  lastCalibrateProfile!:IGetLastCalibrateDetailResponse;
  currentStateCalibration:StateCalibration = StateCalibration.PreCalibratation;

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
        text: 'Custom Chart Title'
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
    clip: {left: false, top: false, right: 1000, bottom: false},
    pointBorderWidth:5,
    pointHoverBorderWidth:10
  };

  constructor(private router:Router
              ,private usersService:UsersService
              ,private devicesService:DevicesService
              ,private casesService:CasesService
              ,private calibrateProfileService:CalibrateProfileService) { }

  ngOnInit() : void {
    this.CheckConnectedDevice();
    this.CheckIDCard();
    this.CheckCalibrateProfile();
  }

  async CheckConnectedDevice(): Promise<IGetConnectedDeviceResponse>{
    await this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        AuthUtils.SetCurrentDevice(res.device);
        this.currentDevice =  AuthUtils.GetCurrentDevice();

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
    ToolUtils
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

        const data:ICalibrateProfile = res.calibrate_profile;

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

  changeMode(mode:any){
    this.mode = mode;
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
    if(this.devicesService.IsConnected())
    {
      this.mode = Mode.Calibration;
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

  
  onClickCleaning(){
    if(this.devicesService.IsConnected())
    {
      this.mode = Mode.Cleaning;
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

  onClickCollectingData(){
    if(this.devicesService.IsConnected())
    {
      this.mode = Mode.CollectingData;
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

  onClickHome(): void{
    this.router.navigateByUrl('/');
  }

  onClickBack(): void{
    this.mode = Mode.Menu;
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

  public get Mode(): typeof Mode {
    return Mode; 
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
