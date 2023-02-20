import { Component } from '@angular/core';

@Component({
  selector: 'app-start-pre-processing',
  templateUrl: './start-pre-processing.component.html',
  styleUrls: ['./start-pre-processing.component.scss']
})
export class StartPreProcessingComponent {
  value: number = 0;
  min: number = 1;
  max: number = 3;

  ngOnInit() {
    let interval = setInterval(() => {
        this.value = this.value + Math.floor(Math.random() * (this.min + this.max + 1)) + this.min;
        if (this.value >= 99) {
            this.value = 99;

            clearInterval(interval);
        }
    }, 1*1000);
}
}
