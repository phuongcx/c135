import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service'; 
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-share-layout',
  templateUrl: './share-layout.component.html',
  styleUrls: ['./share-layout.component.scss'],
  providers: [ AuthService ]
})
export class ShareLayoutComponent implements OnInit {
  
  private username: string = localStorage.getItem('userName');
  constructor(private authService: AuthService, private router: Router) { }
  

  ngOnInit() {
    $(document).ready(function() {
      $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
      });
    });
  }

  isLoggedIn(){
    return this.authService.IsLoggedIn();
  }

  logout(){
    this.authService.Logout();
    this.router.navigate(['/login']);
  }
}
