import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDevice } from 'src/app/api/models/device.model';
import { DevicesService } from 'src/app/api/services/devices.service';
import { UsersService } from 'src/app/api/services/users.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
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
  IsDialogLoading: boolean = true;

  constructor(private router: Router
              ,private authService:AuthService
              ,private devicesService:DevicesService) { }

  ngOnInit(): void {
    this.CurrentUser = AuthUtils.GetSessionUser();
    this.CurrentDevice = AuthUtils.GetSessionDevice();
    console.log("CurrentUser",this.CurrentUser);
    console.log("CurrentDevice",this.CurrentDevice);
  }

  onClickSwitch(): void{
    if(!this.displayModal)
    {
      this.displayModal = true;
      
      var arg = this.devicesService.GetListDevices();
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
        sessionStorage.setItem("device",deviceString);

        this.IsDialogLoading = false;
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
}
