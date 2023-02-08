import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { environment } from 'src/environments/environment';
import { IConnectResponse } from '../models/device.model';
import { ITestDetailResponse } from '../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  BaseUrl:string = environment.apiUrl + "/tests";

  constructor(private http:HttpClient) { }
  
  StartPreTest(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/start_pre_test",
      {
        headers: httpHeaders
      }
    );
  }
  
  StartCollecting(): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/start_collecting",
      {
        headers: httpHeaders
      }
    );
  }
  
  StopTest(testId:number): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    const body = {
      "test_id" : testId
    };

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/stop_test",
      body,
      {
        headers: httpHeaders
      }
    );
  }

  GetTestDetail(testId:number): Observable<ITestDetailResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.get<ITestDetailResponse>(
      this.BaseUrl+"/"+testId,
      {
        headers: httpHeaders
      }
    );
  }

  EndTest(testId:number): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    const body = {
      "test_id" : testId
    };

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/end_test",
      body,
      {
        headers: httpHeaders
      }
    );
  }
}
