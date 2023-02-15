import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { environment } from 'src/environments/environment';
import { IGetLastCalibrateDetailResponse } from '../models/calibrate_profile.model';
import { IConnectResponse } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class CalibrateProfileService {
  BaseUrl:string = environment.apiUrl + "/calibrate_profiles";

  constructor(private http:HttpClient) { }

  GetLastCalibrate(): Observable<IGetLastCalibrateDetailResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.get<IGetLastCalibrateDetailResponse>(
      this.BaseUrl+"/get_last_calibrate",
      {
        headers: httpHeaders
      }
    );
  }

  StartCalibrate(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/start_calibrate",
      {
        headers: httpHeaders
      }
    );
  }

  EndCalibrate(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/end_calibrate",
      {
        headers: httpHeaders
      }
    );
  }
}
