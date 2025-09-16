import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { filter } from 'rxjs';
import { ChecklistService } from '../../services/checklist.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Checklist } from '../../models/checklist';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { EventTriggerService } from '../../services/event-trigger.service';

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    ModalComponent,
    ReactiveFormsModule,
    CommonModule,
    FontAwesomeModule,
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  fb = inject(NonNullableFormBuilder);

  faPenToSquare = faPenToSquare;
  faEllipsis = faEllipsis;

  checklistData: Checklist[] | undefined;

  isProfileNav: boolean = false;
  isChecklistNav: boolean = false;

  isEditModalOpen: boolean = false;
  isCreateModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  createChecklistFormSubmitted: boolean = false;
  editChecklistFormSubmitted: boolean = false;
  duplicateChecklistError: boolean = false;
  emptyChecklistError: boolean = false;
  serverError: boolean = false;

  checklistName: string | undefined;
  checklistToDelete: number | undefined;

  constructor(
    private router: Router,
    private checklistService: ChecklistService,
    private eventTriggerService: EventTriggerService
  ) {}

  ngOnInit() {
    if (this.router.url.includes('/app/profile')) {
      this.isProfileNav = true;
      this.isChecklistNav = false;
    }

    if (this.router.url.includes('/app/checklist')) {
      this.isProfileNav = false;
      this.isChecklistNav = true;

      this.getChecklists();
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/app/profile') {
          this.isProfileNav = true;
          this.isChecklistNav = false;
        }

        if (event.url === '/app/checklist') {
          this.isProfileNav = false;
          this.isChecklistNav = true;

          this.getChecklists();
        }
      });

    // Moves checklist to top of the side panel list wnen its checklist items are modified in 'checklist-page' component
    this.eventTriggerService.titleEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res === 'refreshChecklistData') {
          this.getChecklists();
        }
      });

    // Stops the edit/remove modal from appearing if checklist has unsaved changes and user tries to edit/delete a checklist in 'checklist-page' component
    this.eventTriggerService.modalEvent$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res === 'closeModal') {
          this.closeModal();
        }
      });
  }

  createChecklistForm = this.fb.group({
    title: new FormControl('', [Validators.required]),
  });

  editChecklistForm = this.fb.group({
    id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
  });

  getChecklists() {
    this.checklistService
      .getChecklists()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.checklistData = res;

          if (this.checklistData && this.checklistData.length > 0) {
            // On page refresh. If no item id in url then load the first item in the arr, OR if there is id then do nothing to the url
            const urlParamId = Number(this.router.url.split('checklist/')[1]);
            const checklistExists = this.checklistData.find(
              (el) => el.id === urlParamId
            );
            if (isNaN(urlParamId) || !checklistExists) {
              this.router.navigate([
                `/app/checklist/${this.checklistData[0].id}`,
              ]);
            }
          } else {
            this.router.navigate([`/app/checklist/`]);
          }
        },
        error: (err) => {
          console.log('Failed to get checklist data: ', err);
        },
      });
  }

  resetModalForm() {
    this.createChecklistForm.reset();
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.createChecklistFormSubmitted = false;
    this.emptyChecklistError = false;
    this.duplicateChecklistError = false;
  }

  openEditModal(id: number, title: string) {
    this.isEditModalOpen = true;
    this.editChecklistFormSubmitted = false;
    this.emptyChecklistError = false;
    this.duplicateChecklistError = false;

    this.editChecklistForm.patchValue({
      id: String(id),
      title: title,
    });
  }

  openDeleteModal(id: number) {
    this.isDeleteModalOpen = true;
    this.checklistToDelete = id;
  }

  closeModal() {
    this.isCreateModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.serverError = false;
    this.resetModalForm();
  }

  onCreateChecklistSubmit() {
    this.createChecklistFormSubmitted = true;
    this.duplicateChecklistError = false;
    this.emptyChecklistError = false;

    const value = this.createChecklistForm.value;

    if (!value.title || value.title?.trim() === '') {
      this.emptyChecklistError = true;
      return;
    }

    if (value.title && this.checklistData) {
      const dupeChecklist = this.checklistData.find(
        (e) => e.title?.toLowerCase() === value.title!.toLowerCase()
      );
      if (dupeChecklist) {
        this.duplicateChecklistError = true;
        return;
      }
    }

    const newChecklist: Checklist = {
      title: value.title!,
    };

    this.checklistService
      .createChecklist(newChecklist)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.getChecklists();
          this.closeModal();
          this.router.navigate([`/app/checklist/${res.id}`]);
        },
        error: (err) => {
          this.serverError = true;
          console.log('Error createing checklist: ', err);
        },
      });
  }

  editChecklistSubmit() {
    this.editChecklistFormSubmitted = true;
    this.duplicateChecklistError = false;
    this.emptyChecklistError = false;

    const editedValue = this.editChecklistForm.value;

    if (!editedValue.title || editedValue.title?.trim() === '') {
      this.emptyChecklistError = true;
      return;
    }

    if (editedValue.title && this.checklistData) {
      const dupeChecklist = this.checklistData.find(
        (e) =>
          e.title?.toLowerCase() === editedValue.title!.toLowerCase() &&
          e.id !== Number(editedValue.id)
      );
      if (dupeChecklist) {
        this.duplicateChecklistError = true;
        return;
      }
    }

    const editedChecklist: Checklist = {
      title: editedValue.title!,
    };

    this.checklistService
      .editChecklist(editedChecklist, Number(editedValue.id))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_) => {
          this.getChecklists();
          this.closeModal();
          this.eventTriggerService.getTitleTrigger('refreshChecklistData');
        },
        error: (err) => {
          this.serverError = true;
          console.log('Error editing checklist: ', err);
        },
      });
  }

  deleteChecklistSubmit(id: number) {
    this.checklistService
      .deleteChecklist(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (_) => {
          this.getChecklists();
          this.closeModal();
        },
        error: (err) => {
          console.log('Error deleting checklist: ', err);
        },
      });
  }
}
