import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { AuthModel } from '../../models/auth.model';



@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}
  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  // public methods
  login(email: string, password: string): Observable<any> {
    var loginInfo = {
      userName:email,
      password:password
    }
    return this.http.post<AuthModel>(this.baseUrl+"Auth/login", loginInfo);
    // return this.http.post<AuthModel>(`${API_USERS_URL}/login`, {
    //   email,
    //   password,
    // });
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.baseUrl, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${this.baseUrl}/me`, {
      headers: httpHeaders,
    });
  }
}
