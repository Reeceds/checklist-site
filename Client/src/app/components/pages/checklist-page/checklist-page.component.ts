import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { ChecklistService } from '../../../services/checklist.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
} from '@angular/cdk/drag-drop';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-checklist-page',
  imports: [
    InputSaveComponent,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './checklist-page.component.html',
  styleUrl: './checklist-page.component.scss',
})
export class ChecklistPageComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  checklist: Checklist | undefined;
  checkedItems: ChecklistItem[] | undefined = [];
  uncheckedItems: ChecklistItem[] | undefined = [];

  paramId: number | undefined;

  constructor(
    private checklistService: ChecklistService,
    private route: ActivatedRoute,
    private router: Router,
    private checklistItemService: ChecklistItemService
  ) {}

  ngOnInit(): void {
    this.getChecklistById();
  }

  getChecklistById() {
    this.route.params.subscribe((params) => {
      this.paramId = params['id'];

      if (this.paramId) {
        this.checklistService
          .getChecklistById(this.paramId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              if (res) {
                this.checklist = res;
              }

              if (res?.checklistItems) {
                this.checkedItems = res.checklistItems
                  .filter((e) => e.isChecked === 1)
                  .map((el, i) => ({
                    ...el,
                    tempId: i,
                  }));

                this.uncheckedItems = res.checklistItems
                  .filter((e) => e.isChecked === 0)
                  .map((el, i) => ({
                    ...el,
                    tempId: i,
                  }));
              }
              console.log('ggg', this.checklist);
            },
            error: (err) => console.log('Failed to get checklist: ', err),
          });
      }
    });
  }

  onAddItem(item: ChecklistItem) {
    if (this.checkedItems || this.uncheckedItems) {
      let positionArr: number[] = [];
      let tempIdArr: number[] = [];

      this.checkedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.tempId!);
      });

      this.uncheckedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.tempId!);
      });

      let maxPosition = positionArr.length > 0 ? Math.max(...positionArr) : 0;
      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      item.position = maxPosition + 1;
      item.tempId = maxTempId + 1;
    }

    this.uncheckedItems!.push(item);
  }

  onEditContent(value: string, id: number) {
    const editCheckedItem = this.checkedItems?.find((i) => i.tempId === id);
    const edituncheckedItem = this.checkedItems?.find((i) => i.tempId === id);
    if (editCheckedItem) editCheckedItem!.content = value;
    if (edituncheckedItem) edituncheckedItem!.content = value;
  }

  onToggleChecked(id: number) {
    const wasChecked = this.checkedItems?.find(
      (i) => i.tempId === id && i.isChecked === false
    );
    const wasUnchecked = this.uncheckedItems?.find(
      (i) => i.tempId === id && i.isChecked === true
    );

    if (wasChecked) {
      let positionArr: number[] = [];
      let tempIdArr: number[] = [];
      const wasCheckedIndex = this.checkedItems?.indexOf(wasChecked);

      this.uncheckedItems!.forEach((el, i) => {
        positionArr.push(el.position!);
        tempIdArr.push(el.tempId!);
      });

      let maxPosition = positionArr.length > 0 ? Math.max(...positionArr) : 0;
      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      const newUncheckedItem: ChecklistItem = {
        ...wasChecked,
        position: maxPosition + 1,
        tempId: maxTempId + 1,
        isChecked: 0,
      };

      this.uncheckedItems?.push(newUncheckedItem);
      this.checkedItems?.splice(wasCheckedIndex!, 1);
    }

    if (wasUnchecked) {
      let tempIdArr: number[] = [];
      const wasUncheckedIndex = this.uncheckedItems?.indexOf(wasUnchecked);

      this.checkedItems!.forEach((el, i) => {
        tempIdArr.push(el.tempId!);
      });

      let maxTempId = tempIdArr.length > 0 ? Math.max(...tempIdArr) : 0;

      const newCheckedItem: ChecklistItem = {
        ...wasUnchecked,
        position: 0,
        tempId: maxTempId + 1,
        isChecked: 1,
      };

      this.checkedItems?.push(newCheckedItem);
      this.uncheckedItems?.splice(wasUncheckedIndex!, 1);
    }
  }

  onDeleteItem(checkedVal: any, id: number) {
    const checkedItem = this.checkedItems!.find(
      (e) => e.tempId === id && e.isChecked === checkedVal
    );
    const uncheckedItem = this.uncheckedItems!.find(
      (e) => e.tempId === id && e.isChecked === checkedVal
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
        next: (res) => {},
        error: (err) => {
          console.log('Error saving checklistItems: ', err);
        },
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.uncheckedItems!,
      event.previousIndex,
      event.currentIndex
    );

    this.uncheckedItems!.map((el, i) => {
      el.position = i + 1;
    });

    console.log(this.uncheckedItems);
  }
}
