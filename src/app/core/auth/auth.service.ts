import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ILoginReponse } from 'src/app/models/common/login';
import { Role } from 'src/app/models/common/role';
import { IUser } from 'src/app/models/common/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject!: BehaviorSubject<IUser> ;
  public user!: Observable<IUser>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    var sessionUser = sessionStorage.getItem("user") ?? "";
    if(sessionUser != "")
    {
      this.userSubject = new BehaviorSubject<IUser>(JSON.parse(sessionUser));
      this.user = this.userSubject.asObservable();
    }
  }

  public get userValue(): IUser {
      return this.userSubject.value;
  }


  login(username: string, password: string): Observable<ILoginReponse>{
      return this.http.post<any>(`${environment.apiUrl}/users/login`, { username, password })
          .pipe(map(user => {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              const userString = JSON.stringify(user);
              sessionStorage.setItem('user', userString);

              //this.userSubject.next(user);
              return user;
          }));
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}


