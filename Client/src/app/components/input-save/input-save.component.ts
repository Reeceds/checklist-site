import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  output,
  Output,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ChecklistItem } from '../../models/checklistItem';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-input-save',
  // 'host' allows a class to be added to a component which is rendered via <router-outlet>
  host: {
    class: 'input-save-component',
  },
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './input-save.component.html',
  styleUrl: './input-save.component.scss',
})
export class InputSaveComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  fb = inject(NonNullableFormBuilder);

  faPlus = faPlus;

  @Output() newItem = new EventEmitter<ChecklistItem>();
  @Output() saveChecklist = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  createChecklistItem = this.fb.group({
    content: new FormControl('', [Validators.required]),
  });

  createChecklistItemSubmit() {
    const value = this.createChecklistItem.value.content;

    if (!value || value.trim() === '') {
      // console.log('Empty value.');
      return;
    }

    const item: ChecklistItem = {
      content: value!,
      is_checked: false,
      position: 0,
    };

    this.newItem.emit(item);
    this.createChecklistItem.reset();
  }

  save() {
    this.saveChecklist.emit();
  }
}
