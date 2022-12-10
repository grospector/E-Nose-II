import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.scss']
})
export class DeviceModalComponent {
  @Input() displayModal!:boolean;
  @Output() displayModalChange = new EventEmitter<boolean>();
}
