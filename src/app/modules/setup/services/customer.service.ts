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
  providedIn: 'root'
})
export class CustomerService {

  onCustomerCreated: Subject<any> = new Subject<any>();
  constructor(private httpClient: HttpClient) {}
  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  createCustomer(data): Observable<any> {
    
    return this.httpClient
      .post<any>(this.baseUrl + 'Customer/Create', data)
      .pipe(catchError(this.handleError));
  }

  UpdateCustomer(customerId,data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Customer/Update?id=' + customerId, data)
      .pipe(catchError(this.handleError));
  }
  UpdateCustomerOpeningElectricMeterReading(customerId,data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Customer/UpdateCustomerOpeningElectricMeterReading?customerId=' + customerId, data)
      .pipe(catchError(this.handleError));
  }
  UpdateCustomerActiveDate(customerId,data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Customer/UpdateCustomerActiveDate?customerId=' + customerId, data)
      .pipe(catchError(this.handleError));
  }
  UpdateCustomerAdvance(customerId,data): Observable<any> {
    return this.httpClient
      .put<any>(this.baseUrl + 'Customer/UpdateCustomerAdvance?customerId=' + customerId, data)
      .pipe(catchError(this.handleError));
  }

  getById(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Customer/GetById?id=' + id)
      .pipe(catchError(this.handleError));
  }
  getByComplexId(id): Observable<any> {
    return this.httpClient
      .get<any>(this.baseUrl + 'Customer/GetByComplexId?complexId=' + id)
      .pipe(catchError(this.handleError));
  }
  deleteCustomer(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.baseUrl + 'Customer/' + id)
      .pipe(catchError(this.handleError));
  }

  getAllCustomers(){
    return this.httpClient.get<any>(this.baseUrl + 'Customer/GetAll').pipe(catchError(this.handleError))
  }
  getCusotmerWithServiceBill(){
    return this.httpClient.get<any>(this.baseUrl + 'Customer/GetCustomerWithServiceBill').pipe(catchError(this.handleError))
  }

  getCustomerPagination(page?, itemPerPage?, searchKey?) {
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
      .get<any[]>(this.baseUrl + 'Customer', {
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

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error);
    } else {
      console.error('Server Side error', errorResponse);
    }
    return throwError('There is a problem with the service');
  }

}
