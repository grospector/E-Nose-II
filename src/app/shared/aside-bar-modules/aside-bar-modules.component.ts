import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUtils } from 'src/app/core/auth/auth.utils';
import { EnumModules } from '../footer-modules/footer-modules';

@Component({
  selector: 'app-aside-bar-modules',
  templateUrl: './aside-bar-modules.component.html',
  styleUrls: ['./aside-bar-modules.component.scss']
})
export class AsideBarModulesComponent {
  @Input() module:EnumModules = EnumModules.Dashboard;
  isShowLabel:boolean = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isShowLabel = AuthUtils.GetAsideBar();
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
      case 2:
        this.router.navigateByUrl('/test-report');
        break;
      case 3:
        this.router.navigateByUrl('/case-management');
        break;
      case 4:
        this.router.navigateByUrl('/device-setting');
        break;
      case 5:
        this.router.navigateByUrl('/account-setting');
        break;
    }
  }

  onClickShowLabel(){
    this.isShowLabel = !this.isShowLabel;
    AuthUtils.SetAsideBar(this.isShowLabel);
  }
}
