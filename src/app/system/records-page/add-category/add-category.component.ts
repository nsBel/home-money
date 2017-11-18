import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CategoriesService} from '../../shared/services/categories.service';
import {CategoryModel} from '../../shared/models/category.model';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
@Output() oncategoryAdd = new EventEmitter<CategoryModel>();

  constructor(
    private categoriesService: CategoriesService
  ) { }

  onSubmit(form: NgForm) {
    let { name, capacity } = form.value;

    if (capacity < 0) {
      capacity *= -1;
    }

    const category = new CategoryModel(name, capacity);

    this.categoriesService.addCategory(category)
      .subscribe((category: CategoryModel) => {
        form.reset();
        form.form.patchValue({capacity: 1});
        this.oncategoryAdd.emit(category);
      });
  }
}
