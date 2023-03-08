import { NgModule, isDevMode } from '@angular/core';
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

import { faUsersGear, faFlaskVial , faHandSparkles , faHouse , 
        faCircleChevronLeft , faListCheck, faMagnifyingGlassChart ,
        faHouseChimney , faFolderPlus , faGears, faChalkboardUser, faFileWaveform, faClipboard, faAnglesRight, faAnglesLeft, faHandPointer, fas } from '@fortawesome/free-solid-svg-icons';

import { faHandPointer as farHandPointerl, far } from '@fortawesome/free-regular-svg-icons';

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
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { SplitterModule } from 'primeng/splitter';
import { CarouselModule } from 'primeng/carousel';

import { AuthInterceptor } from './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { DeviceModalComponent } from './shared/modal/device-modal/device-modal.component';
import { CollectingDataComponent } from './shared/collecting-data/collecting-data.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CheckInitComponent } from './shared/check-init/check-init.component';
import { CalibrationComponent } from './shared/calibration/calibration.component';
import { CleaningComponent } from './shared/cleaning/cleaning.component';
import { LoaddingScreenComponent } from './shared/loadding-screen/loadding-screen.component';
import { StartPreProcessingComponent } from './shared/start-pre-processing/start-pre-processing.component';
import { EndPreProcessingComponent } from './shared/end-pre-processing/end-pre-processing.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ResultComponent } from './modules/result/result.component';
import { AsideBarComponent } from './shared/aside-bar/aside-bar.component';
import { AsideBarModulesComponent } from './shared/aside-bar-modules/aside-bar-modules.component';

import { NgxsModule } from '@ngxs/store';
import { StateMode } from './store/state-mode.store';


const config: SocketIoConfig = {
	url: environment.socketUrl,
	options: {
		//transports: ['websocket']
	}
}

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
    TestReportComponent,
    DeviceModalComponent,
    CollectingDataComponent,
    CheckInitComponent,
    CalibrationComponent,
    CleaningComponent,
    LoaddingScreenComponent,
    StartPreProcessingComponent,
    EndPreProcessingComponent,
    ResultComponent,
    AsideBarComponent,
    AsideBarModulesComponent,
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
    CheckboxModule,
    ChartModule,
    ProgressBarModule,
    QRCodeModule,
    SplitterModule,
    CarouselModule,
		SocketIoModule.forRoot(config),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }), 
    NgxsModule.forRoot([StateMode], {
      developmentMode: !environment.production
    }),
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
    // library.addIcons(faUsersGear);
    // library.addIcons(faFlaskVial);
    // library.addIcons(faHandSparkles);
    // library.addIcons(faHouse);
    // library.addIcons(faCircleChevronLeft);
    // library.addIcons(faListCheck);
    // library.addIcons(faMagnifyingGlassChart);
    // library.addIcons(faHouseChimney);
    // library.addIcons(faFolderPlus);
    // library.addIcons(faGears);
    // library.addIcons(faChalkboardUser);
    // library.addIcons(faFileWaveform);
    // library.addIcons(faClipboard);
    // library.addIcons(faAnglesRight);
    // library.addIcons(faAnglesLeft);
    // library.addIcons(faHandPointer);
    
    library.addIconPacks(fas , far);
  }
 }
