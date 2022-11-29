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
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule,FaIconLibrary  } from '@fortawesome/angular-fontawesome';

import { faUsersGear } from '@fortawesome/free-solid-svg-icons';
import { FooterModulesComponent } from './shared/footer-modules/footer-modules.component';
import { AccountSettingComponent } from './modules/account-setting/account-setting.component';
import { HeaderModulesComponent } from './shared/header-modules/header-modules.component';

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
    HeaderModulesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library:FaIconLibrary){
    library.addIcons(faUsersGear);
  }
 }
