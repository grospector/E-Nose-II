import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { environment } from 'src/environments/environment';
import { IConnectResponse } from '../models/device.model';
import { IGetReportsDashboardResponse } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  BaseUrl:string = environment.apiUrl + "/reports";

  constructor(private http:HttpClient) { }

  GetDashboard(): Observable<IGetReportsDashboardResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    const params: HttpParams = new HttpParams()
    // .set("keyword",keyword)
    // .set("limit",10)
    // .set("offset",0)
    // .set("order_by",EnumOrderBy.CreateAtDesc)

    return this.http.get<IGetReportsDashboardResponse>(
      this.BaseUrl+"/dashboard",
      {
        //params: params,
        headers: httpHeaders
      }
    );
  }
}
