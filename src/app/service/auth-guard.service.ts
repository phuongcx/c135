import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, public authService: AuthService ) {}

  public canActivate(next: ActivatedRouteSnapshot): boolean {
    const isLoggedIn: string = this.authService.IsLoggedIn();
    if (isLoggedIn) 
    {
      var roles = next.data['roles'] as Array<string>;
      var permissions = next.data['permission'] as Array<string>;

      if(roles)
      {
        var isMatchPermission;
        if(permissions)
        {
          isMatchPermission = this.authService.permissionMatch(permissions);
        }
        else
        {
          isMatchPermission = true;
        }
        var isMatchRole = this.authService.roleMatch(roles);
        if(isMatchRole && isMatchPermission)
        {
          return true;
        }
        else
        {
          this.router.navigate(['/forbidden']);
          return false;
        } 
      }
      else
      {
        return true;
      }
    } 
    else 
    {
      this.router.navigate(['/login']);
      return false;
    }
  }

}