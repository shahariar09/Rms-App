import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  onUnitCreated: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) {}

  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  createUnit(data): Observable<any> {
    return this.httpClient
      .post<any>(this.baseUrl + 'Unit', data)
      .pipe(catchError(this.handleError));
  }

  updateUnit(data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Unit/' + data.id, data)
      .pipe(catchError(this.handleError));
  }

  getUnitPagination(page?, itemPerPage?, searchKey?) {
    const paginatedResult: PaginatedResult<any[]> = new PaginatedResult<
      any[]
    >();

    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any[]>(this.baseUrl + 'Unit', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Unit/' + id)
      .pipe(catchError(this.handleError));
  }
  deleteUnit(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'Unit/' + id)
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
