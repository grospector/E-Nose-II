import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IConnectResponse, IDevice } from 'src/app/api/models/device.model';
import { DevicesService } from 'src/app/api/services/devices.service';
import Swal from 'sweetalert2';
import { Mode } from './testing';

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

  constructor(private router:Router,
              private devicesService:DevicesService) { }

  ngOnInit() : void {
    if(this.devicesService.IsConnected()){

    }
    else{

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
}
