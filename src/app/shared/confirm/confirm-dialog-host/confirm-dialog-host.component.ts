import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from './confirm-dialogue.service';
import { ConfirmDialogComponent } from '../confirm.component';


@Component({
  selector: 'app-confirm-dialog-host',
  standalone: true,
  imports:[CommonModule, ConfirmDialogComponent],
  template:`

    <app-confirm-dialog
      *ngIf="visible"
      [title]="title"
      [message]="message">
    </app-confirm-dialog>

  `
})
export class ConfirmDialogHostComponent {

  visible = false;
  title = '';
  message = '';

  constructor(private dialog:ConfirmDialogService){

    this.dialog.dialogState$.subscribe(data=>{
      this.visible = true;
      this.title = data.title;
      this.message = data.message;
    });

    this.dialog.confirmResult$.subscribe(()=>{
      this.visible = false;
    });

  }
}