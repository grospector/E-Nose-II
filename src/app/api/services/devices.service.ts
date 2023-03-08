import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { EnumConnectionStatus } from 'src/app/models/common/enum';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IConnectResponse, IDevice, IGetDeviceDetailResponse, IListDevicesReponse } from '../models/device.model';
import { IGetConnectedDeviceResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  BaseUrl:string = environment.apiUrl + "/devices";

  constructor(private http:HttpClient) { }

  Connect(deviceSerialNo:string): Observable<IConnectResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    const body = {
      "device_mac_serial_no":deviceSerialNo
    };

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/connect",
      body,
      {
        headers: httpHeaders
      }
    );
  }

  IsConnected(): boolean {
    const deviceJson = localStorage.getItem("device");

    if(deviceJson){
      const device:IDevice = <IDevice>JSON.parse(deviceJson ?? "")
    
      return true;
    }
    else{
      return false;
    }
  }

  ChangeStatus(deviceSerialNo:string,status:EnumConnectionStatus): Observable<IGetDeviceDetailResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    const body = {
      "mac_serial_no": deviceSerialNo,
      "status": status
    };

    return this.http.post<IGetDeviceDetailResponse>(
      this.BaseUrl+"/change_status",
      body,
      {
        headers: httpHeaders
      }
    );
  }

  GetDeviceDetail(deviceId:number): Observable<IConnectResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.get<IConnectResponse>(
      this.BaseUrl+"/"+deviceId,
      {
        headers: httpHeaders
      }
    );
  }

  GetListDevices(keyword:string,status:string,offset:number,limit:number): Observable<IListDevicesReponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    // .set("keyword",true)
    // .set("order_by",true)
    // .set("limit",true)
    // .set("offset",true)

    const params: HttpParams = new HttpParams()
      .set("is_active",true)
      .set("status",status)
      .set("offset",offset)
      .set("limit",limit)
      .set("keyword",keyword);

    return this.http.get<IListDevicesReponse>(
      this.BaseUrl,
      {
        params: params,
        headers: httpHeaders
      }
    );
  }

  CommandTest(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/command_test",
      "",
      {
        headers: httpHeaders
      }
    );
  }

  
  CommandStopTest(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/command_stop_test",
      "",
      {
        headers: httpHeaders
      }
    );
  }

  CommandCleaning(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/command_cleaning",
      "",
      {
        headers: httpHeaders
      }
    );
  }

  Update(deviceId:number,name:string,mac_serial_no:string,isActive:boolean): Observable<any>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    const body =  {
      "name":name,
      "mac_serial_no":mac_serial_no,
      "is_active":isActive
    };
    
    return this.http.put<any>(
      this.BaseUrl + '/' + deviceId,
      body,
      {
        headers: httpHeaders
      }
    );
  }
  
  Delete(deviceId:number): Observable<any>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.delete<any>(
      this.BaseUrl + '/' + deviceId,
      {
        headers: httpHeaders
      }
    );
  }
}
