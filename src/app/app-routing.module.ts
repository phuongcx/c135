import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from './service/auth-guard.service';
import { NotfoundComponent } from './not-found/not-found.component';
import { UserMainComponent } from './user-main/user-main.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleComponent } from './role/role.component';
import { LogMainComponent } from './log-main/log-main.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: DashboardComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} },
  { path: 'user-main', component: UserMainComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} },    
  { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} }, 
  { path: 'role-main', component: RoleComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} },
  { path: 'role-details/:id', component: RoleDetailsComponent, canActivate: [AuthGuard], data: {roles: ['Admin']} },
  { path: 'log-main', component: LogMainComponent, canActivate: [AuthGuard], data: {roles: ['Admin', 'User'], permission: ['1', '3', '5', '7']} },
  { path: 'log-details/:id', component: LogDetailsComponent, canActivate: [AuthGuard], data: {roles: ['Admin', 'User'], permission: ['1', '3', '5', '7']} },
  { path: 'forbidden', component: ForbiddenComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
