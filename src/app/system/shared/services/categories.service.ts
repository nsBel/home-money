import {BaseApi} from '../core/base-api';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategoryModel} from '../models/category.model';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class CategoriesService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.post('categories', category);
  }

  getCategories(): Observable<CategoryModel[]> {
    return this.get('categories');
  }
  updateCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.put(`categories/${category.id}`, category);
  }
  getCategoryById(id: number): Observable<CategoryModel> {
    return this.get(`categories/${id}`);
  }
}
