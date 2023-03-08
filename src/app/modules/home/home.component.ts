import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDevice, IGetDeviceDetailResponse } from 'src/app/api/models/device.model';
import { IGuide } from 'src/app/api/models/guide.model';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { DevicesService } from 'src/app/api/services/devices.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { EnumConnectionStatus } from 'src/app/models/common/enum';
import { IUser } from 'src/app/models/common/user';
import Swal from 'sweetalert2';
import { quickGuidesAsset } from './quck-guide';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  Devices!:IDevice[];
  CurrentUser!:IUser;
  CurrentDevice!:IDevice;

  displayModal!: boolean;
  displayModalQuickGuide!: boolean;
  IsDialogLoading: boolean = true;

  responsiveOptions:any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
        breakpoint: '768px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '560px',
        numVisible: 3,
        numScroll: 3
    }
  ];
  quickGuides:IGuide[] = quickGuidesAsset;

  constructor(private router: Router
              ,private authService:AuthService
              ,private devicesService:DevicesService
              ,private usersService:UsersService) {

  }

  ngOnInit(): void {
    this.CurrentUser = AuthUtils.GetCurrentUser();
    console.log("CurrentUser",this.CurrentUser);

    this.usersService.GetConnectedDeviceDetail().subscribe((res:IGetConnectedDeviceResponse) => {
      if(res?.success)
      {
        AuthUtils.SetCurrentDevice(res.device);

        this.CurrentDevice = AuthUtils.GetCurrentDevice();
        console.log("CurrentDevice",this.CurrentDevice);
      }
      else{
        
      }
    });
  }

  onClickSwitch(): void{
    if(!this.displayModal)
    {
      this.displayModal = true;
      const offset:number = 0;
      const limitRow:number = 1;
      
      var arg = this.devicesService.GetListDevices("",EnumConnectionStatus.WaitingConnection,offset,limitRow);
      arg.subscribe(res =>{
        if(res?.success)
        {
          this.IsDialogLoading = false;
          this.Devices = res.devices;
        }
        else{
          this.IsDialogLoading = false;

          Swal.fire({
            title: `Can't get List Devices`,
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

  onClickConnect(macSerialNo:string): void{
    this.IsDialogLoading = true;

    var arg = this.devicesService.Connect(macSerialNo);
    arg.subscribe(res =>{
      if(res.success)
      {
        this.devicesService.ChangeStatus(macSerialNo,EnumConnectionStatus.Ready).subscribe((resChangeStatus:IGetDeviceDetailResponse) =>{
          if(resChangeStatus?.success)
          {
            this.IsDialogLoading = false;
            this.displayModal = false;

            this.CurrentDevice = <IDevice>this.Devices.find(d => d.mac_serial_no == macSerialNo); 
            const deviceString = JSON.stringify(this.CurrentDevice);
            localStorage.setItem("device",deviceString);
          }
          else{
            this.IsDialogLoading = false;
            this.displayModal = false;
          }
        });
      }
      else{
        this.IsDialogLoading = false;
        
        Swal.fire({
          title: `Error mac-serial-no:${macSerialNo} can't connect`,
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
  
  onClickLogout(): void{
    this.authService.logout();
  }

  onClickMobule(module:string): void{
    this.router.navigateByUrl('/'+module);
  }

  onClickQuickGuide(): void{
    this.displayModalQuickGuide = true;
  }
}
