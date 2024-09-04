import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() public message: string | null = null;
  @Input() public isHtml: boolean = false;

  public modalTitle: string | null = null;
  @Input()
  set title(value: string | null) {
    this.modalTitle = value || "Confirmation";
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void { 
  }

  ok() {
    this.activeModal.close(true);
  }

}
