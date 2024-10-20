import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillGenerateService {


  constructor(private httpClient: HttpClient) { }

  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  electricBillCreate(data): Observable<any> {

    return this.httpClient
      .post<any>(this.baseUrl + 'BillGenerate/CreateElectricBill', data)
      .pipe(catchError(this.handleError));
  }
  rentBillCreate(data): Observable<any> {

    return this.httpClient
      .post<any>(this.baseUrl + 'BillGenerate/CreateRentBill', data)
      .pipe(catchError(this.handleError));
  }
  createUtilityBill(data): Observable<any> {

    return this.httpClient
      .post<any>(this.baseUrl + 'BillGenerate/CreateUtilityBill', data)
      .pipe(catchError(this.handleError));
  }
  getGenerateRentBill(customerId):Observable<any>{
    return this.httpClient.get<any>(this.baseUrl + 'BillGenerate/GenerateRentBill?customerId='+customerId).pipe(catchError(this.handleError))
  }
  getCustomerWiseDueArrear(billType,customerId,date):Observable<any>{
    debugger
    return this.httpClient.get<any>(this.baseUrl + 'BillGenerate/GetCustomerWiseDueArrear?billType='+billType+'&customerId='+customerId+'&date='+date).pipe(catchError(this.handleError))
  }

  getElectricBillByCriteria(page?, itemPerPage?, searchKey?,customerId?,billPayStatus?): Observable<any> {
    

    let params = new HttpParams();

    if (customerId) {
      params = params.append('CustomerId', customerId);
    }
    if (billPayStatus!=null) {
      params = params.append('BillPayStatus', billPayStatus);
    }

    
    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(this.baseUrl + 'BillGenerate/getElectricBillByCriteria', {
        params,
      })
      .pipe(catchError(this.handleError));
  }
  GetRentAndUtilityBillByCustomer(page?, itemPerPage?, searchKey?,customerId?): Observable<any> {

    let params = new HttpParams();
    if (customerId) {
      params = params.append('CustomerId', customerId);
    }

    
    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(this.baseUrl + 'BillGenerate/GetRentAndUtilityBillByCustomer', {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  getUtilityBillByCriteria(page?, itemPerPage?, searchKey?,customerId?,billPayStatus?): Observable<any> {
    

    let params = new HttpParams();

    if (customerId) {
      params = params.append('CustomerId', customerId);
    }
    if (billPayStatus!=null) {
      params = params.append('BillPayStatus', billPayStatus);
    }

    
    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', page);
      params = params.append('PageParams.PageSize', itemPerPage);
    }

    return this.httpClient
      .get<any>(this.baseUrl + 'BillGenerate/GetUtilityBillByCriteria', {
        params,
      })
      .pipe(catchError(this.handleError));
  }

  

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', errorResponse.error);
    } else {
      console.error('Server Side error', errorResponse);
    }
    return throwError(errorResponse);
  }

}
