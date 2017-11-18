import {BaseApi} from '../core/base-api';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AppEventModel} from '../models/event.model';

@Injectable()
export class EventsService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  addEvent(event: AppEventModel): Observable<AppEventModel> {
    return this.post('events', event);
  }
  getEvents(): Observable<AppEventModel[]> {
    return this.get('events');
  }
  getEventById(id: string): Observable<AppEventModel> {
    return this.get(`events/${id}`);
  }
}
