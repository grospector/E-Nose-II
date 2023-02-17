import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loadding-screen',
  templateUrl: './loadding-screen.component.html',
  styleUrls: ['./loadding-screen.component.scss']
})
export class LoaddingScreenComponent {
  @Input() message = '';

  constructor() { }

  ngOnInit() {
  }
}
