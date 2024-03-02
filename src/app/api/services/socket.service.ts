import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ICollectingData } from '../models/data.model';
import { IDevice } from '../models/device.model';
import { ICalibrateSocketResponse, ISocketResponse, IStatusSocketResponse } from '../models/socket.mode';
import { DevicesService } from './devices.service';
import { connect, StringCodec } from "nats.ws";
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { IShowCollectCalibrateProfile } from '../models/calibrate_profile.model';
import { EnumConnectionStatus, EnumSocketCommand } from 'src/app/models/common/enum';
// const io = require("socket.io-client/dist/socket.io")

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private device: IDevice = {
    connecting_user_id: '',
    connecting_user_name: '',
    created_at: '',
    id: -1,
    is_active: false,
    is_connecting: false,
    mac_serial_no: '',
    name: '',
    status: '',
    updated_at: '',
    working_test_id: ''
  };

  private socket: any;

  public res$: BehaviorSubject<ISocketResponse> = new BehaviorSubject(<ISocketResponse>{});
  public calibrateRes$: BehaviorSubject<ICalibrateSocketResponse> = new BehaviorSubject(<ICalibrateSocketResponse>{});
  public statusRes$: BehaviorSubject<IStatusSocketResponse> = new BehaviorSubject(<IStatusSocketResponse>{});

	constructor() { 
    this.device = JSON.parse(localStorage.getItem("device") ?? this.device.toString());
    this.socket = io(environment.socketUrl, { transports: ['websocket'] });
   
    this.subscribeToSocketEvents();
  }

  private subscribeToSocketEvents() {
    const channel = `_e-nose_user_device_${this.device?.mac_serial_no}`;

    this.socket.emit('subscribe_nats', { "channel_name": channel });

    this.socket.on(channel, (res: any) => {
      if (res.command === EnumSocketCommand.ShowTestData) {
        this.res$.next(res);
      } else if (res.command === EnumSocketCommand.ShowCollectCalibrateData) {
        this.calibrateRes$.next(res);
      } else if(res.command === EnumSocketCommand.ChangeStatus){
        this.statusRes$.next(res);
      }
    });
  }

  public getNewRes(): Observable<ISocketResponse> {
    return this.res$.asObservable();
  }

  public getCalibrateRes(): Observable<ICalibrateSocketResponse> {
    return this.calibrateRes$.asObservable();
  }

  public getStatus(): Observable<IStatusSocketResponse> {
    return this.statusRes$.asObservable();
  }
}
