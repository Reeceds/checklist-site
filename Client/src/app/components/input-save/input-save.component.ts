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

@Component({
  selector: 'app-input-save',
  imports: [ReactiveFormsModule],
  templateUrl: './input-save.component.html',
  styleUrl: './input-save.component.scss',
})
export class InputSaveComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  fb = inject(NonNullableFormBuilder);

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
      console.log('Empty value.');
      return;
    }

    const item: ChecklistItem = {
      content: value!,
      isChecked: false,
      position: 0,
    };

    this.newItem.emit(item);
    this.createChecklistItem.reset();
  }

  save() {
    this.saveChecklist.emit();
  }
}
