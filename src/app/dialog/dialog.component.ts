import {Component, inject} from '@angular/core';
import {DIALOG_DATA, DialogRef} from "@angular/cdk/dialog";

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  dialogCount = inject(DIALOG_DATA);
  dialog = inject(DialogRef)

  closeDialog = () => {
    this.dialog.close();
  }
}
