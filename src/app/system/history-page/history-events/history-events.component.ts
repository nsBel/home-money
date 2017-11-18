import {Component, Input, OnInit} from '@angular/core';
import {AppEventModel} from '../../shared/models/event.model';
import {CategoryModel} from '../../shared/models/category.model';

@Component({
  selector: 'app-history-events',
  templateUrl: './history-events.component.html',
  styleUrls: ['./history-events.component.scss']
})
export class HistoryEventsComponent implements OnInit {

  @Input() categories: CategoryModel[] = [];
  @Input() events: AppEventModel[] = [];

  searchValue = '';
  searchPlaceholder = 'Amount';
  searchField = 'amount';

  constructor() {
  }

  ngOnInit() {
    this.events.forEach((e) => {
      e.catName = this.categories.find((c) => c.id === e.category).name;
    });
  }

  getEventClass(e: AppEventModel) {
    return {
      'label': true,
      'label-danger': e.type === 'outcome',
      'label-success': e.type === 'income'
    };
  }
  changeCriteria(field: string) {
    const namesMap = {
      amount: 'Amount',
      date: 'Date',
      category: 'Category',
      type: 'Type'
    };
    this.searchPlaceholder = namesMap[field];
    this.searchField = field;
  }

}
