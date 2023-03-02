import { Component, OnInit } from '@angular/core';
import { IDevice, IListDevicesReponse } from 'src/app/api/models/device.model';
import { DevicesService } from 'src/app/api/services/devices.service';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import { IUser } from 'src/app/models/common/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss']
})
export class DeviceSettingComponent implements OnInit {
  loading:boolean = true;

  devices:IDevice[] = [];

  constructor(private devicesService:DevicesService) { }

  ngOnInit(): void {
    this.devicesService.GetListDevices("").subscribe((res:IListDevicesReponse) => {
      if(res?.success)
      {
        this.loading = false;
        this.devices = res.devices;
      }
      else{
        this.loading = false;
        Swal.fire({
          title: `Error!!! Test get list that don't response`,
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

  getGetUserRole(){
    const currentUser:IUser = AuthUtils.GetCurrentUser();
    return currentUser.role;
  }

  onClickReset(userId:number){
    Swal.fire({
      title: 'Reset',
      text: 'Do you want to reset setting',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reset',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          
        }
      }
    );
  }

  onClickDelete(userId:number){
  }

  
  public FormatFullDate(date:string){
    return ToolUtils.FormatFullDate(date);
  }
}
