import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillCollectionService {

  constructor(private httpClient: HttpClient) { }

  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  billCollection(data): Observable<any> {

    return this.httpClient
      .post<any>(this.baseUrl + 'BillCollection/Create', data)
      .pipe(catchError(this.handleError));
  }
  

  

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error);
    } else {
      console.error('Server Side error', errorResponse);
    }
    return throwError('There is a problem with the service');
  }

}
