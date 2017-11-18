import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseApi} from '../core/base-api';
import {Observable} from 'rxjs/Observable';
import {BillModel} from '../models/bill.model';

@Injectable()
export class BillService extends BaseApi{
  constructor(
    public http: HttpClient
  ) {
    super(http);
  }

  getBill(): Observable<BillModel> {
    return this.get('bill');
  }

  getCurrency(base: string = 'RUB'): Observable<any> {
    return this.http.get(`https://api.fixer.io/latest?base=${base}`);
  }
  updateBill(bill: BillModel): Observable<BillModel> {
    return this.put('bill', bill);
  }
}
