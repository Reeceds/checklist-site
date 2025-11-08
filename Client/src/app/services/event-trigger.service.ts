import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
//! This allows one component to trigger an action in a different unrelated (none parent/child) component. Can also be used with BehaviorSubject instead of Subject to pass the latest data
export class EventTriggerService {
  constructor() {}

  private titleEventSource = new Subject<string>(); // This gets modified and set as a string via trigger() in COMPONENT 1
  titleEvent$ = this.titleEventSource.asObservable(); // COMPONENT 2 subscribes to this value which can be used to trigger an event

  private modalEventSource = new Subject<string>();
  modalEvent$ = this.modalEventSource.asObservable();

  private pendingEventSource = new Subject<boolean>();
  pendingEvent$ = this.pendingEventSource.asObservable();

  getTitleTrigger(event: string) {
    this.titleEventSource.next(event);
  }

  closeModalTrigger(event: string) {
    this.modalEventSource.next(event);
  }

  getPendingTrigger(event: boolean) {
    this.pendingEventSource.next(event);
  }
}
