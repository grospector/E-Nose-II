import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IConnectResponse } from 'src/app/api/models/device.model';
import { TestsService } from 'src/app/api/services/tests.service';
import { EnumConnectionStatus } from 'src/app/models/common/enum';
import { Mode } from 'src/app/modules/testing/testing';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-end-pre-processing',
  templateUrl: './end-pre-processing.component.html',
  styleUrls: ['./end-pre-processing.component.scss']
})
export class EndPreProcessingComponent {
  @Input() ConnectingStatus:EnumConnectionStatus = EnumConnectionStatus.EndPreProcessing;
  @Output() modeEvent = new EventEmitter<Mode>()

  constructor(private testsService:TestsService) { }

  onClickStartCollectingDataFromSample() : void{
    this.testsService.StartCollecting().subscribe((res:IConnectResponse) => {
      if(res.success)
      {
        this.modeEvent.emit(Mode.CollectingData);
      }
      else{
        Swal.fire({
          title: `Error can't start collecting data`,
          text: res.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    })
  }
}
