import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from './confirm-dialog-host/confirm-dialogue.service';
// import { ConfirmDialogService } from './confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="backdrop">
      <div class="dialog">

        <h3>{{ title }}</h3>
        <p>{{ message }}</p>

        <div class="actions">
          <button class="btn-confirm" (click)="confirm()">Confirm</button>
          <button class="btn-cancel" (click)="cancel()">Cancel</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .backdrop{
      position:fixed;
      inset:0;
      background:rgba(0,0,0,.45);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:1000;
    }

    .dialog{
      background:var(--bg-card);
      padding:24px;
      width:320px;
      border-radius:12px;
      box-shadow:var(--shadow-lg);
      animation:dialogIn .2s ease;
    }

    @keyframes dialogIn{
      from{transform:scale(.9);opacity:0;}
      to{transform:scale(1);opacity:1;}
    }

    .actions{
      display:flex;
      justify-content:flex-end;
      gap:10px;
      margin-top:18px;
    }

    button{
      padding:6px 14px;
      border-radius:6px;
      border:1px solid var(--border);
      cursor:pointer;
    }

    .btn-confirm{
      background:var(--accent);
      color:white;
      border:none;
    }
  `]
})
export class ConfirmDialogComponent {

  @Input() title = '';
  @Input() message = '';

  constructor(private dialogService: ConfirmDialogService){}

  confirm(){
    this.dialogService.confirm();
  }

  cancel(){
    this.dialogService.cancel();
  }
}