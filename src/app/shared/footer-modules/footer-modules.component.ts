import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumModules } from './footer-modules';

@Component({
  selector: 'app-footer-modules',
  templateUrl: './footer-modules.component.html',
  styleUrls: ['./footer-modules.component.scss']
})
export class FooterModulesComponent implements OnInit {
  @Input() module:EnumModules = EnumModules.Dashboard;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClickModule(module:EnumModules){
    switch(module)
    {
      default:
      case 0:
        this.router.navigateByUrl('/');
        break;
      case 1:
        this.router.navigateByUrl('/dashboard');
        break;
      case 5:
        this.router.navigateByUrl('/account-setting');
        break;
    }
  }
}
