import { Injectable } from '@angular/core';
import { Subject, Observable, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {

  private dialogState = new Subject<{
    title: string;
    message: string;
  }>();

  private confirmResult = new Subject<boolean>();

  dialogState$ = this.dialogState.asObservable();
  confirmResult$ = this.confirmResult.asObservable();   // 👈 expose observable

  open(title: string, message: string): Observable<boolean> {

    this.dialogState.next({ title, message });

    return this.confirmResult$.pipe(take(1));

  }

  confirm() {
    this.confirmResult.next(true);
  }

  cancel() {
    this.confirmResult.next(false);
  }
}