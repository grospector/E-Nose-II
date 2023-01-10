import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mode } from './testing';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent implements OnInit {

  containerModule = document.querySelector<HTMLElement>('.parent');
  mouseDown = false;
  startX: any;
  scrollLeft: any;
  isShowMenu:boolean = true;
  mode:Mode = Mode.Menu;

  constructor(private router:Router) { }

  ngOnInit() : void {
  }

  startDragging(e:any, flag:any, el:any) {
    this.mouseDown = true;
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }
  stopDragging(e:any, flag:any) {
    this.mouseDown = false;
  }
  moveEvent(e:any, el:any) {
    e.preventDefault();
    if (!this.mouseDown) {
      return;
    }
    console.log(e);
    const x = e.pageX - el.offsetLeft;
    const scroll = x - this.startX;
    el.scrollLeft = this.scrollLeft - scroll;
  }

  onClickCollectingData(){
    this.mode = Mode.CollectingData;
  }

  onClickHome(): void{
    this.router.navigateByUrl('/');
  }

  onClickBack(): void{
    this.mode = Mode.Menu;
  }
}
