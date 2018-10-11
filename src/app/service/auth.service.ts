import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()

export class AuthService {
    constructor(private http: Http) { }

    public Login(UserName: string, Password: string) {
        var data = "username=" + UserName + "&password=" + Password + "&grant_type=password";
        return this.http.post("http://localhost:19949/token", data)
            .pipe(map(res => res.json()));
    }

    public SetSession(username: string, result) {
        localStorage.setItem('userName', username);
        localStorage.setItem('userID', result.userID);
        localStorage.setItem('userToken', result.access_token);
        localStorage.setItem('userRole', result.role);
        localStorage.setItem('permission', result.permission);
    }

    public IsLoggedIn() {
        return localStorage.getItem('userToken');
    }

    public Logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('userID');
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('permission');
    }

    public roleMatch(allowedRoles) {
        var userRole: string = JSON.parse(localStorage.getItem('userRole'));
        if (allowedRoles.indexOf(userRole) > -1) {
            return true;
        }
        return false;
    }

    public permissionMatch(allowedPermission) {
        var permission: string = JSON.parse(localStorage.getItem('permission'));
        if (allowedPermission.indexOf(permission) > -1) 
        {
            return true;
        }
        return false;
    }
}