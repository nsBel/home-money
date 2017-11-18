import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {CategoriesService} from '../shared/services/categories.service';
import {EventsService} from '../shared/services/events.service';
import {Observable} from 'rxjs/Observable';
import {BillModel} from '../shared/models/bill.model';
import {CategoryModel} from '../shared/models/category.model';
import {AppEventModel} from '../shared/models/event.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-planning-page',
  templateUrl: './planning-page.component.html',
  styleUrls: ['./planning-page.component.scss']
})
export class PlanningPageComponent implements OnInit, OnDestroy {

  isLoaded = false;
  s1: Subscription;
  bill: BillModel;
  categories: CategoryModel[] = [];
  events: AppEventModel[] = [];

  constructor(private billService: BillService,
              private categoriesService: CategoriesService,
              private eventsService: EventsService) {
  }

  ngOnInit() {
    this.s1 = Observable.combineLatest(
      this.billService.getBill(),
      this.categoriesService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [BillModel, CategoryModel[], AppEventModel[]]) => {
      this.bill = data[0];
      this.categories = data[1];
      this.events = data[2];
      this.isLoaded = true;
    });
  }

  getCategoryCost(cat: CategoryModel): number {
    const catEvents = this.events.filter(e => e.category === cat.id && e.type === 'outcome');
    return catEvents.reduce((total, e) => {
      total += e.amount;
      return total;
    }, 0);
  }

  private getPercent(cat: CategoryModel): number {
    const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
    return percent > 100 ? 100 : percent;
  }

  getCatPercent(cat: CategoryModel): string {
    return this.getPercent(cat) + '%';
  }

  getColorClass(cat: CategoryModel): string {
    const percent = this.getPercent(cat);
    return percent <= 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
  }

  ngOnDestroy(): void {
    if (this.s1) {
      this.s1.unsubscribe();
    }
  }

}
