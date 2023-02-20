import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loadding-screen',
  templateUrl: './loadding-screen.component.html',
  styleUrls: ['./loadding-screen.component.scss']
})
export class LoaddingScreenComponent {
  @Input() message = '';
  @Input() countdown = 0;

  constructor() { }

  ngOnInit() {
    if(this.countdown > 0)
    {
      const t = setInterval(() => {
        if(this.countdown >= 0)
        {
          this.countdown = this.countdown - 1
        }
        else
        {
          clearInterval(t);
        }
      },1000)
    }
  }
}
