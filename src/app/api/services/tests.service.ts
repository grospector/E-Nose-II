import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { environment } from 'src/environments/environment';
import { IConnectResponse } from '../models/device.model';
import { IStartPreTestRequest, ITestDetailResponse, ITestsGetListResponse } from '../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  BaseUrl:string = environment.apiUrl + "/tests";

  constructor(private http:HttpClient) { }
  
  GetListTests(keyword:string,offset:number,limit:number): Observable<ITestsGetListResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    const params: HttpParams = new HttpParams()
      .set("offset",offset)
      .set("limit",limit)
      .set("keyword",keyword);
      // .set("case_id","")
      // .set("device_id","")
      // .set("start_date","")
      // .set("end_date","");
      
    return this.http.get<ITestsGetListResponse>(
      this.BaseUrl,
      {
        headers: httpHeaders,
        params: params
      }
    );
  }

  StartPreTest(body:IStartPreTestRequest): Observable<IConnectResponse> {
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });

    return this.http.post<IConnectResponse>(
      this.BaseUrl+"/start_pre_test",
      body,
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
      "",
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

  
  ClearCurrentTestingId() : void{
    sessionStorage.setItem("TestId","");
  }

  GetCurrentTestingId() : number{
    const testId = Number.parseInt(sessionStorage.getItem("TestId") || "");
    return testId
  }

  SetCurrentTestingId(testId:number) : void{
    sessionStorage.setItem("TestId",testId.toString());
  }

  
  ClearTempTesting() : void{
    sessionStorage.setItem("TempTesting","");
  }

  GeTempTesting() : any{
    const tempTesting = (sessionStorage.getItem("TempTesting") || "");
    return JSON.parse(tempTesting)
  }

  SetTempTesting(tempTesting:any) : void{
    sessionStorage.setItem("TempTesting",JSON.stringify(tempTesting));
  }
}
