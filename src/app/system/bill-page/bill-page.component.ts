import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {Observable} from 'rxjs/Observable';
import {BillModel} from '../shared/models/bill.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {


  isLoaded = false;
  currency: any;
  bill: BillModel;
  sub1: Subscription;


  constructor(private billService: BillService) {}

  ngOnInit() {
    this.sub1 = Observable.combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [BillModel, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.sub1.unsubscribe();
  }

  onRefresh() {
    this.isLoaded = false;
    this.sub1 = Observable.combineLatest(
      this.billService.getBill(),
      this.billService.getCurrency()
    ).subscribe((data: [BillModel, any]) => {
      this.bill = data[0];
      this.currency = data[1];
      this.isLoaded = true;
    });
  }
}
