import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-modules',
  templateUrl: './header-modules.component.html',
  styleUrls: ['./header-modules.component.scss']
})
export class HeaderModulesComponent implements OnInit {
  @Input() title = '';

  constructor() { }

  ngOnInit(): void {
  }

}
