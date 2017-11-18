import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Observable} from 'rxjs/Observable';
import {CategoryModel} from '../shared/models/category.model';
import {AppEventModel} from '../shared/models/event.model';
import {Subscription} from 'rxjs/Subscription';
import * as moment from 'moment';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(private categoriesService: CategoriesService,
              private eventsService: EventsService) {
  }

  isLoaded = false;
  chartData = [];
  s1: Subscription;
  categories: CategoryModel[] = [];
  events: AppEventModel[] = [];
  filteredEvents: AppEventModel[] = [];
  isFilterVisible = false;

  ngOnInit() {
    this.s1 = Observable.combineLatest(
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [CategoryModel[], AppEventModel[]]) => {
      this.categories = data[0];
      this.events = data[1];
      this.setOriginalEvents();
      this.calculateChartData();
      this.isLoaded = true;
    });
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice();
  }

  calculateChartData(): void {
    this.chartData = [];

    this.categories.forEach((cat) => {
      const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push({
        name: cat.name,
        value: catEvent.reduce((total, e) => {
          total += e.amount;
          return total;
        }, 0)
      });
    });
  }

  private toggleFilterVisibilty(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibilty(true);
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibilty(false);
    this.setOriginalEvents();
    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');
    this.filteredEvents = this.filteredEvents
      .filter((e) => {
        return filterData.types.indexOf(e.type) !== -1;
      })
      .filter((e) => {
      return filterData.categories.indexOf(e.category.toString()) !== -1;
      })
      .filter((e) => {
        const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
        return momentDate.isBetween(startPeriod, endPeriod);
      });
    this.calculateChartData();
  }

  onFilterCancel() {
    this.toggleFilterVisibilty(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy(): void {
    if (this.s1) {
      this.s1.unsubscribe();
    }
  }

}
