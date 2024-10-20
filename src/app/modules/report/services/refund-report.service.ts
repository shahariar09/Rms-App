import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RefundReportService {
  windowObj: any = window;
  baseUrl =  this.windowObj.__env.apiUrl;
  constructor(private http: HttpClient) {}
  getMemServicesList(page?, itemPerPage?, searchKey?) {
    let params = new HttpParams();

    if (searchKey != null) {
      params = params.append('PageParams.SearchKey', searchKey);
    }

    if (page != null && itemPerPage != null) {
      params = params.append('PageParams.PageNumber', 1);
      params = params.append('PageParams.PageSize', 1000);
    }

    return this.http
      .get<any>(this.baseUrl+`v1/MemServices/GetAll`, {
        params,
      })
      .pipe(map((response: any) => response));
  }
  getEventRefundSummaryReport(
    fromDate,
    toDate,
    eventId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('EventId', eventId);
    params = params.set('MembershipNo', membershipNo);
    return this.http.get(
      this.baseUrl+`v1/Refund/EventRefundSummaryReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getEventRefundDetailReport(
    fromDate,
    toDate,
    eventId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('EventId', eventId);
    params = params.set('MembershipNo', membershipNo);

    return this.http.get(
      this.baseUrl+`v1/Refund/EventRefundDetailReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getServiceRefundSummaryReport(
    fromDate,
    toDate,
    serviceId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('ServiceId', serviceId);
    params = params.set('MembershipNo', membershipNo);
    return this.http.get(
      this.baseUrl+`v1/Refund/ServiceRefundSummaryReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getServiceRefundDetailReport(
    fromDate,
    toDate,
    serviceId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('ServiceId', serviceId);
    params = params.set('MembershipNo', membershipNo);

    return this.http.get(
      this.baseUrl+`v1/Refund/ServiceRefundDetailReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getVenueBookingRefundSummaryReport(
    fromDate,
    toDate,
    venueId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('VenueId', venueId);
    params = params.set('MembershipNo', membershipNo);
    return this.http.get(
      this.baseUrl+`v1/Refund/VenueBookingRefundSummaryReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }

  getVenueBookingRefundDetailReport(
    fromDate,
    toDate,
    venueId,
    membershipNo
  ): Observable<Blob> {
    let params = new HttpParams();

    params = params.set('FromDate', fromDate);
    params = params.set('ToDate', toDate);
    params = params.set('VenueId', venueId);
    params = params.set('MembershipNo', membershipNo);

    return this.http.get(
      this.baseUrl+`v1/Refund/VenueBookingRefundDetailReport`,
      {
        responseType: 'blob',
        params: params,
      }
    );
  }
}
