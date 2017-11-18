import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {CategoryModel} from '../../shared/models/category.model';
import {NgForm} from '@angular/forms';
import {AppEventModel} from '../../shared/models/event.model';
import * as moment from 'moment';
import {EventsService} from '../../shared/services/events.service';
import {BillService} from '../../shared/services/bill.service';
import {BillModel} from '../../shared/models/bill.model';
import {mergeMap} from 'rxjs/operator/mergeMap';
import {MessageModel} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {

  @Input() categories: CategoryModel[] = [];

  sub1: Subscription;
  sub2: Subscription;

  types = [
    {type: 'income', label: 'Income'},
    {type: 'outcome', label: 'Outcome'}
  ];

  message: MessageModel;

  constructor(private eventsService: EventsService,
              private billService: BillService) {
  }

  ngOnInit() {
    this.message = new MessageModel('danger', '');
  }

  ngOnDestroy(): void {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();

    }
  }

  private showMsg(text: string) {
    this.message.text = text;
    window.setTimeout(() => {
      this.message.text = '';
    }, 5000);
  }

  onSubmit(form: NgForm) {
    let {amount, description, category, type} = form.value;
    if (amount < 0) {
      amount *= -1;
    }
    const event = new AppEventModel(
      type,
      amount,
      +category,
      moment().format('DD.MM.YYYY HH.mm.ss'),
      description
    );
    this.sub1 = this.billService.getBill()
      .subscribe((bill: BillModel) => {
        let value = 0;
        if (type === 'outcome') {
          if (amount > bill.value) {
            this.showMsg(`Вам не хватает ${amount - bill.value}`);
            return;
          } else {
            value = bill.value - amount;
          }
        } else {
          value = bill.value + amount;
        }
        this.sub2 = this.billService.updateBill({value, currency: bill.currency})
          .mergeMap(() => this.eventsService.addEvent(event))
          .subscribe(() => {
            form.reset();
          });
      });
  }
}
