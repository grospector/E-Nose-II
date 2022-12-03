import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { environment } from 'src/environments/environment';
import { IConnectResponse, IListDevicesReponse } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  BaseUrl:string = environment.apiUrl + "/devices";

  constructor(private http:HttpClient) { }

  GetListDevices(): Observable<IListDevicesReponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetSession().access_token ?? "",
    });

    
    const params: HttpParams = new HttpParams()
      .set("is_active",true)
      .set("status",true)
      .set("keyword",true)
      .set("order_by",true)
      .set("limit",true)
      .set("offset",true);

    return this.http.get<IListDevicesReponse>(
      this.BaseUrl,
      {
        headers: httpHeaders
      }
    );
  }

  Connect(deviceSerialNo:string): Observable<IConnectResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetSession().access_token ?? "",
    });
    
    const body = {
      "device_mac_serial_no":deviceSerialNo
    };

    return this.http.post<IConnectResponse>(
      this.BaseUrl,
      body,
      {
        headers: httpHeaders
      }
    );
  }
}
