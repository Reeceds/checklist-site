import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CanComponentDeactivate } from './can-component-deactivate.interface';

@Injectable({
  providedIn: 'root',
})
export class PendingChangesGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(component: CanComponentDeactivate): boolean | Promise<boolean> {
    // If component has canDeactivate method, call it
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
