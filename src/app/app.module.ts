import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './modules/account/sign-in/sign-in.component';
import { HomeComponent } from './modules/home/home.component';
import { AboutComponent } from './shared/about/about.component';
import { ContactComponent } from './shared/contact/contact.component';
import { ContactUsComponent } from './shared/contact-us/contact-us.component';
import { FooterComponent } from './shared/footer/footer.component';
import { TestingComponent } from './modules/testing/testing.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { GuideComponent } from './shared/guide/guide.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsersGear } from '@fortawesome/free-solid-svg-icons';

import { FooterModulesComponent } from './shared/footer-modules/footer-modules.component';
import { AccountSettingComponent } from './modules/account-setting/account-setting.component';
import { HeaderModulesComponent } from './shared/header-modules/header-modules.component';
import { DeviceSettingComponent } from './modules/device-setting/device-setting.component';
import { CaseManagementComponent } from './modules/case-management/case-management.component';
import { TestReportComponent } from './modules/test-report/test-report.component';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    ContactUsComponent,
    GuideComponent,
    FooterComponent,
    TestingComponent,
    DashboardComponent,
    FooterModulesComponent,
    AccountSettingComponent,
    HeaderModulesComponent,
    DeviceSettingComponent,
    CaseManagementComponent,
    TestReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    InputTextModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    CheckboxModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library:FaIconLibrary){
    library.addIcons(faUsersGear);
  }
 }
