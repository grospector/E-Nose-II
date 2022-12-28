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
    var localUser = localStorage.getItem("user") ?? "";
    if(localUser != "")
    {
      this.userSubject = new BehaviorSubject<IUser>(JSON.parse(localUser));
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
              localStorage.setItem('user', userString);

              //this.userSubject.next(user);
              return user;
          }));
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/sign-in']);
  }
}


