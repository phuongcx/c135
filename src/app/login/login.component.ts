import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private isExistUsername: boolean = true;
  private isExistPassword: boolean = true;
  private httpSubscription: Subscription = new Subscription();

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.authService.IsLoggedIn())
    {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(){
    this.httpSubscription.unsubscribe();
  }
  
  OnSubmit(formSignIn){
     this.httpSubscription.add(this.authService.Login(formSignIn.value.userName, formSignIn.value.password)
     .subscribe(result => {
       if(result == 0){
         this.isExistPassword = false;
       }
       else if(result == -1){
         this.isExistUsername = false;
         this.isExistPassword = false;
       }
       else{
        this.authService.SetSession(formSignIn.value.userName, result);
          if(JSON.parse(result.role) == "Admin")
          {
            window.location.href = '/home';
          }
          else
          {
            window.location.href = '/log-main';
          }
        }
       
    }));
  }

}
