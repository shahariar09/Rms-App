import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BillReportService {

  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;

  constructor(private http: HttpClient) { }
  getElectricBillReport(customerId,month): Observable<Blob> {
    const url = this.baseUrl+`BillReport/ElectricBill?customerId=${customerId}&month=${month}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  RentAndUtilityBillReport(customerId,month): Observable<Blob> {
    const url = this.baseUrl+`BillReport/RentAndUtilityBill?customerId=${customerId}&month=${month}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  UtilityBillReport(customerId,month): Observable<Blob> {
    const url = this.baseUrl+`BillReport/UtilityBill?customerId=${customerId}&month=${month}`;
    return this.http.get(url, { responseType: 'blob' });
  }

}
