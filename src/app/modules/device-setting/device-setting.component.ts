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
  displayModalEditDevice:boolean = false;

  editDeviceId:number = 0;
  inputDeviceName:string = "";
  inputDeviceMacSerialId:string = "";
  cbDeviceIsActive:boolean = false;

  inputSearch:string = "";

  totalRecords!:number;
  tableOffset!:number;
  limitRow:number = 10;

  constructor(private devicesService:DevicesService) { }

  ngOnInit(): void {
    this.FetchListDevices(0);
  }

  FetchListDevices(offset:number):void{
    this.tableOffset = offset;
    this.loading = true;
    this.devicesService.GetListDevices(this.inputSearch,"",offset,this.limitRow).subscribe((res:IListDevicesReponse) => {
      if(res?.success)
      {
        this.loading = false;
        this.devices = res.devices;
        this.totalRecords = res.count_total;
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

  onClickEdit(deviceId:number){
    Swal.fire({
      title: 'Do you want to edit',
      text: `Device ID : ${deviceId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Edit',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          this.displayModalEditDevice = true;

          const device:IDevice = <IDevice>this.devices.find(d => d.id == deviceId);
          this.editDeviceId = device.id;
          this.inputDeviceName = device.name;
          this.inputDeviceMacSerialId = device.mac_serial_no;
          this.cbDeviceIsActive = device.is_active;
        }
      }
    );
  }

  editDevice() :void{
    this.displayModalEditDevice = false;

    this.devicesService.Update(this.editDeviceId,this.inputDeviceName,this.inputDeviceMacSerialId,this.cbDeviceIsActive).subscribe((res:any) => {
      if(res?.success)
      {
        Swal.fire({
          title: `Device ID : ${this.editDeviceId} is edited`,
          text: res?.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
            this.FetchListDevices(this.tableOffset);
          }
        );
      }
      else
      {
        Swal.fire({
          title: `Error!!! ${this.editDeviceId} can't edit`,
          text: res?.message,
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
            this.FetchListDevices(this.tableOffset);
          }
        );
      }
    })
  }

  onClickDelete(deviceId:number){
    Swal.fire({
      title: 'Do you want to delete',
      text: `Device ID : ${deviceId}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(
      (result) => {
        if(result.isConfirmed){
          this.devicesService.Delete(deviceId).subscribe((res:any) => {
            if(res?.success)
            {
              Swal.fire({
                title: `Device ID : ${deviceId} is deleted`,
                text: res?.message,
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(
                (result) => {
                  this.FetchListDevices(this.tableOffset);
                }
              );
            }
            else{
              Swal.fire({
                title: `Error!!! ${deviceId} can't delete`,
                text: res?.message,
                icon: 'error',
                confirmButtonText: 'OK'
              }).then(
                (result) => {
                  this.FetchListDevices(this.tableOffset);
                }
              );
            }
          });
        }
      }
    );
  }

  
  public FormatFullDate(date:string){
    return ToolUtils.FormatFullDate(date);
  }
}
