import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ChecklistService } from '../../../services/checklist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Checklist } from '../../../models/checklist';
import { InputSaveComponent } from '../../input-save/input-save.component';
import { ChecklistItem } from '../../../models/checklistItem';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChecklistItemService } from '../../../services/checklist-item.service';
import { pipe } from 'rxjs';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  moveItemInArray,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faGripLines,
  faTrash,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { EventTriggerService } from '../../../services/event-trigger.service';
import { CanComponentDeactivate } from '../../../guards/can-component-deactivate.interface';

@Component({
  selector: 'app-checklist-page',
  imports: [
    InputSaveComponent,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './checklist-page.component.html',
  styleUrl: './checklist-page.component.scss',
})
export class ChecklistPageComponent implements OnInit, CanComponentDeactivate {
  faGripLines = faGripLines;
  faTrash = faTrash;
  faTrashCan = faTrashCan;
  faXmark = faXmark;

  destroyRef = inject(DestroyRef);

  checklist: Checklist = {};
  checkedItems: ChecklistItem[] = [];
  uncheckedItems: ChecklistItem[] = [];

  paramId: number | undefined;

  constructor(
    private checklistService: ChecklistService,
    private route: ActivatedRoute,
    private router: Router,
    private checklistItemService: ChecklistItemService,
    private toastr: ToastrService,
    private eventTriggerService: EventTriggerService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.paramId = params['id'];
        if (this.paramId) {
          this.getChecklistById(this.paramId);
        }
      });

    // Causes the title to update when editied in 'side-nav' component
    this.eventTriggerService.titleEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res === 'refreshChecklistData' && this.paramId) {
          this.getChecklistById(this.paramId);
        }
      });
  }

  getChecklistById(id: number) {
    this.checklistService
      .getChecklistById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res) {
            this.checklist = res;
          }

          if (res?.checklist_items) {
            this.checkedItems = res.checklist_items
              .filter((e) => e.is_checked === true)
              .map((el, i) => ({
                ...el,
                temp_id: i,
              }));

            this.uncheckedItems = res.checklist_items
              .filter((e) => e.is_checked === false)
              .map((el, i) => ({
                ...el,
                temp_id: i,
              }));
          }
        },
        error: (err) => console.log('Failed to get checklist: ', err),
      });
  }

  onAddItem(item: ChecklistItem) {
    this.checklistItemService.isChecklistSaved.set(false);

    if (this.checkedItems || this.uncheckedItems) {
      let positionArr: number[] = [];
      let tempIdArr: number[] = [];

      this.checkedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.temp_id!);
      });

      this.uncheckedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.temp_id!);
      });

      let maxPosition = positionArr.length > 0 ? Math.max(...positionArr) : 0;
      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      item.position = maxPosition + 1;
      item.temp_id = maxTempId + 1;
    }

    this.uncheckedItems!.push(item);
  }

  onEditContent(value: string, id: number, chekedVal: any) {
    this.checklistItemService.isChecklistSaved.set(false);

    const editCheckedItem = this.checkedItems?.find(
      (i) => i.temp_id === id && i.is_checked === chekedVal
    );
    const edituncheckedItem = this.uncheckedItems?.find(
      (i) => i.temp_id === id && i.is_checked === chekedVal
    );
    if (editCheckedItem) editCheckedItem!.content = value;
    if (edituncheckedItem) edituncheckedItem!.content = value;
  }

  onToggleChecked(id: number) {
    this.checklistItemService.isChecklistSaved.set(false);

    const wasChecked = this.checkedItems?.find(
      (i) => i.temp_id === id && i.is_checked === false
    );
    const wasUnchecked = this.uncheckedItems?.find(
      (i) => i.temp_id === id && i.is_checked === true
    );

    if (wasChecked) {
      let positionArr: number[] = [];
      let tempIdArr: number[] = [];
      const wasCheckedIndex = this.checkedItems?.indexOf(wasChecked);

      this.uncheckedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.temp_id!);
      });

      let maxPosition = positionArr.length > 0 ? Math.max(...positionArr) : 0;
      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      const newUncheckedItem: ChecklistItem = {
        ...wasChecked,
        position: maxPosition + 1,
        temp_id: maxTempId + 1,
        is_checked: false,
      };

      this.uncheckedItems?.push(newUncheckedItem);
      this.checkedItems?.splice(wasCheckedIndex!, 1);
    }

    if (wasUnchecked) {
      let tempIdArr: number[] = [];
      const wasUncheckedIndex = this.uncheckedItems?.indexOf(wasUnchecked);

      this.checkedItems!.forEach((el, i) => {
        tempIdArr.push(el.temp_id!);
      });

      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      const newCheckedItem: ChecklistItem = {
        ...wasUnchecked,
        position: 0,
        temp_id: maxTempId + 1,
        is_checked: true,
      };

      this.checkedItems?.push(newCheckedItem);
      this.uncheckedItems?.splice(wasUncheckedIndex!, 1);
    }
  }

  onDeleteItem(checkedVal: any, id: number) {
    this.checklistItemService.isChecklistSaved.set(false);

    const checkedItem = this.checkedItems!.find(
      (e) => e.temp_id === id && e.is_checked === checkedVal
    );
    const uncheckedItem = this.uncheckedItems!.find(
      (e) => e.temp_id === id && e.is_checked === checkedVal
    );

    if (checkedItem) {
      const itemIndex = this.checkedItems!.indexOf(checkedItem!);
      this.checkedItems!.splice(itemIndex, 1);
    }
    if (uncheckedItem) {
      const itemIndex = this.uncheckedItems!.indexOf(uncheckedItem!);
      this.uncheckedItems!.splice(itemIndex, 1);
    }
  }

  onSaveItems() {
    const items = this.checkedItems?.concat(this.uncheckedItems!);

    return this.checklistItemService
      .modifyChecklistItem(this.paramId!, items!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_) => {
          this.toastr.success('Saved', '', {
            timeOut: 1000,
          });
          this.eventTriggerService.getTitleTrigger('refreshChecklistData');

          this.checklistItemService.isChecklistSaved.set(true);
        },
        error: (err) => {
          this.toastr.error('Error', '', {
            timeOut: 1000,
          });
          console.log('Error saving checklistItems: ', err);
        },
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    this.checklistItemService.isChecklistSaved.set(false);

    moveItemInArray(
      this.uncheckedItems!,
      event.previousIndex,
      event.currentIndex
    );

    this.uncheckedItems!.map((el, i) => {
      el.position = i + 1;
    });
  }

  canDeactivate(): boolean {
    // Check for unsaved checklistItem changes
    let confirmed: boolean = true;

    if (!this.checklistItemService.isChecklistSaved()) {
      this.eventTriggerService.closeModalTrigger('closeModal');
      confirmed = confirm(
        'You have unsaved changes. Do you really want to leave this page?'
      );
    }

    if (confirmed) {
      this.checklistItemService.isChecklistSaved.set(true);
    }
    return true;
  }
}
