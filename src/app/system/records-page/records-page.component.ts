import { Component, OnInit } from '@angular/core';
import {CategoryModel} from '../shared/models/category.model';
import {CategoriesService} from '../shared/services/categories.service';

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html',
  styleUrls: ['./records-page.component.scss']
})
export class RecordsPageComponent implements OnInit {

  categories: CategoryModel[] = [];
  isLoaded = false;

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories()
      .subscribe((data: CategoryModel[]) => {
        this.categories = data;
        this.isLoaded = true;
      });
  }

  newCategoryAdded(category: CategoryModel) {
    this.categories.push(category);
  }
  categoryChanged(category: CategoryModel) {
    const idx = this.categories
      .findIndex(c => c.id === category.id);
    this.categories[idx] = category;
  }
}
