import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {EventsService} from '../../shared/services/events.service';
import {CategoriesService} from '../../shared/services/categories.service';
import {AppEventModel} from '../../shared/models/event.model';
import {CategoryModel} from '../../shared/models/category.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: AppEventModel;
  category: CategoryModel;

  isLoaded = false;
  s1: Subscription;

  constructor(private route: ActivatedRoute,
              private eventService: EventsService,
              private categoryService: CategoriesService) {
  }

  ngOnInit() {
    this.s1 = this.route.params
      .mergeMap((params: Params) => this.eventService.getEventById(params['id']))
      .mergeMap((event: AppEventModel) => {
        this.event = event;
        return this.categoryService.getCategoryById(event.category);
      })
      .subscribe((category: CategoryModel) => {
        this.category = category;
        this.isLoaded = true;
      });
  }


  ngOnDestroy(): void {
    if (this.s1) {
      this.s1.unsubscribe();
    }
  }
}
