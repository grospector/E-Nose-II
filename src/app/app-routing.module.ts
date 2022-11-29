import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './modules/account/sign-in/sign-in.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GuideComponent } from './shared/guide/guide.component';
import { HomeComponent } from './modules/home/home.component';
import { TestingComponent } from './modules/testing/testing.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { AccountSettingComponent } from './modules/account-setting/account-setting.component';

const routes: Routes = [   
  { path: 'sign-in', component: SignInComponent },  
  {path: 'guide', component: GuideComponent},

  { path: '', component: HomeComponent, canActivate : [AuthGuard] },
  { path: 'testing', component: TestingComponent, canActivate : [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate : [AuthGuard] },
  { path: 'account-setting', component: AccountSettingComponent, canActivate : [AuthGuard] },
  // {
  //   path:'',
  //   children:[
  //     {path: 'sign-in', loadChildren:() => SignInComponent},
  //     {path: 'guide', loadChildren:() => GuideComponent}
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
