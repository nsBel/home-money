import {Component, Input, OnInit} from '@angular/core';
import {BillModel} from '../../shared/models/bill.model';

@Component({
  selector: 'app-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: BillModel;
  @Input() currency: any;
  usd: number;
  eur: number;

  constructor() { }

  ngOnInit() {
    this.usd = this.getConverted(this.bill.value);
    this.eur = this.getConverted(this.bill.value, 'EUR');
  }
  getConverted(amount: number, base: string = 'USD'): number {
    const { rates } = this.currency;
    return amount * rates[base];
  }
}
