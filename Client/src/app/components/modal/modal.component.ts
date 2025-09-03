import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, OnDestroy {
  // Any components importing and using the modal function can now call the 'closeModal()' function to toggle a boolean e.g. *ngIf="isModalOpen" to true or false, in turn this will display/hide the modal
  @Output() closeModal = new EventEmitter<void>();
  @Input() style: string | undefined;

  ngOnInit(): void {
    document.body.classList.add('no-scroll');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
  }

  close() {
    this.closeModal.emit();
  }
}
