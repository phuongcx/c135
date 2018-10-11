import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShareLayoutComponent } from './share-layout/share-layout.component';
import { LoginComponent } from './login/login.component';
import { UserMainComponent } from './user-main/user-main.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LogMainComponent } from './log-main/log-main.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { RoleComponent } from './role/role.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { WebAPIService } from 'src/app/service/web-api.service';
import { AuthGuardService } from './service/auth-guard.service';
import { AuthService } from './service/auth.service';
import { NotfoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AuthInterceptor } from './service/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ShareLayoutComponent,
    LoginComponent,
    UserMainComponent,
    NotfoundComponent,
    LogMainComponent,
    LogDetailsComponent,
    RoleComponent,
    RoleDetailsComponent,
    UserDetailsComponent,
	DashboardComponent,
	ForbiddenComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AngularEditorModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [ 
    AuthGuardService, AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    WebAPIService,
    {
      provide:'Url',
      useValue:'http://localhost:19949/api/'
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
