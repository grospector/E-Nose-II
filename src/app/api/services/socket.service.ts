import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ICollectingData } from '../models/data.model';
import { IDevice } from '../models/device.model';
import { ICalibrateSocketResponse, ISocketResponse } from '../models/socket.mode';
import { DevicesService } from './devices.service';
import { connect, StringCodec } from "nats.ws";
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { IShowCollectCalibrateProfile } from '../models/calibrate_profile.model';
// const io = require("socket.io-client/dist/socket.io")

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  no:number = 0;
  //collectingData = this.socket.fromEvent<ISocketResponse>('subscribe_nats');
  public res$: BehaviorSubject<ISocketResponse> = new BehaviorSubject(<ISocketResponse>{});
  public calibrateRes$: BehaviorSubject<ICalibrateSocketResponse> = new BehaviorSubject(<ICalibrateSocketResponse>{});

  deviceJson = localStorage.getItem("device");
  device:IDevice = <IDevice>JSON.parse(this.deviceJson ?? "")
  socket = io(environment.socketUrl,{transports: ['websocket']}).emit('subscribe_nats', {"channel_name":`_e-nose_user_device_${this.device.mac_serial_no}`});

	constructor() { }

  public getNewRes = () => {
    const deviceJson = localStorage.getItem("device");
    const device:IDevice = <IDevice>JSON.parse(deviceJson ?? "")

    this.socket.on(`_e-nose_user_device_${device.mac_serial_no}`, (res:ISocketResponse) =>{
      this.res$.next(res);
    });

    return this.res$.asObservable();
  };

  public getCalibrateRes = () =>{
    
    const deviceJson = localStorage.getItem("device");
    const device:IDevice = <IDevice>JSON.parse(deviceJson ?? "")

    this.socket.on(`_e-nose_user_device_${device.mac_serial_no}`, (res:ICalibrateSocketResponse) =>{
      this.calibrateRes$.next(res);
    });

    return this.calibrateRes$.asObservable();
  }
}
