import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
//! This allows one component to trigger an action in a different unrelated (none parent/child) component. Can also be used with BehaviorSubject instead of Subject to pass the latest data
export class EventTriggerService {
  constructor() {}

  private eventSource = new Subject<string>(); // This gets modified and set as a string via trigger() in COMPONENT 1
  event$ = this.eventSource.asObservable(); // COMPONENT 2 subscribes to this value which can be used to trigger an event

  trigger(event: string) {
    this.eventSource.next(event);
  }
}
