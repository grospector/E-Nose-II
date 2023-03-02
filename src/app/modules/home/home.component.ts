import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDevice } from 'src/app/api/models/device.model';
import { IGuide } from 'src/app/api/models/guide.model';
import { IGetConnectedDeviceResponse } from 'src/app/api/models/user.model';
import { DevicesService } from 'src/app/api/services/devices.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { EnumConnectionStatus } from 'src/app/models/common/enum';
import { IUser } from 'src/app/models/common/user';
import Swal from 'sweetalert2';

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
  quickGuides:IGuide[] = [
    {
      webpUrl:"assets/guides/Step 1.webp",
      jpgUrl:"assets/guides/Step 1.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 2.webp",
      jpgUrl:"assets/guides/Step 2.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 3.webp",
      jpgUrl:"assets/guides/Step 3.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 4.webp",
      jpgUrl:"assets/guides/Step 4.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 5.webp",
      jpgUrl:"assets/guides/Step 5.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step Stop Testing.webp",
      jpgUrl:"assets/guides/Step Stop Testing.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 6.webp",
      jpgUrl:"assets/guides/Step 6.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step Pre Calibration.webp",
      jpgUrl:"assets/guides/Step Pre Calibration.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 7.webp",
      jpgUrl:"assets/guides/Step 7.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 8.webp",
      jpgUrl:"assets/guides/Step 8.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 9.webp",
      jpgUrl:"assets/guides/Step 9.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step Calibration Cleaning.webp",
      jpgUrl:"assets/guides/Step Calibration Cleaning.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 10.webp",
      jpgUrl:"assets/guides/Step 10.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/START PRE PROCESS.webp",
      jpgUrl:"assets/guides/START PRE PROCESS.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 11.webp",
      jpgUrl:"assets/guides/Step 11.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 12.webp",
      jpgUrl:"assets/guides/Step 12.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step 13.webp",
      jpgUrl:"assets/guides/Step 13.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/QR Code.webp",
      jpgUrl:"assets/guides/QR Code.jpg",
      alt:""
    },
    {
      webpUrl:"assets/guides/Step Final Cleaning.webp",
      jpgUrl:"assets/guides/Step Final Cleaning.jpg",
      alt:""
    }
  ];

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
      
      var arg = this.devicesService.GetListDevices(EnumConnectionStatus.WaitingConnection);
      arg.subscribe(res =>{
        if(res.success)
        {
          this.IsDialogLoading = false;
          this.Devices = res.devices;
        }
        else{
          this.IsDialogLoading = false;
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
        this.CurrentDevice = <IDevice>this.Devices.find(d => d.mac_serial_no == macSerialNo); 
        const deviceString = JSON.stringify(this.CurrentDevice);
        localStorage.setItem("device",deviceString);

        this.IsDialogLoading = false;
        this.displayModal = false;
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
