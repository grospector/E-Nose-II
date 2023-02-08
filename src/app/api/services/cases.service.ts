import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { EnumOrderBy } from 'src/app/models/common/enum';
import { environment } from 'src/environments/environment';
import { IConnectResponse } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class CasesService {
  BaseUrl:string = environment.apiUrl + "/cases";

  constructor(private http:HttpClient) { }

  GetListCases(keyword:string): Observable<IConnectResponse>{
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Authorization':  AuthUtils.GetLocalStorage().access_token ?? "",
    });
    
    const params: HttpParams = new HttpParams()
      .set("keyword",keyword)
      .set("limit",10)
      .set("offset",0)
      .set("order_by",EnumOrderBy.CreateAtDesc)

    return this.http.get<IConnectResponse>(
      this.BaseUrl,
      {
        params: params,
        headers: httpHeaders
      }
    );
  }
}
