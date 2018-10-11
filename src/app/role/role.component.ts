import { WebAPIService } from 'src/app/service/web-api.service';
import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-log',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  constructor(private _service: WebAPIService) { }
  newRole;
  roles;

  ngOnInit() {
    this.GetAllRoles();
  }
  
  private GetAllRoles() {
    this._service.FetchAll('roles').subscribe(data => this.roles = data);
  }

  /**
   * 
   * @param p the permissions number of the role
   * @param a the permission you want to check if exists 
   */
  public CheckPermission(p:number, a:number) {
    var permissions = [];
    var count=p;
    if (count % 2 != 0) {
      //exists 1 (read)
      permissions.push(Math.pow(2, 0));
      count=count-Math.pow(2, 0);
    }
    for (var i = 2; i > 0; i--) {
      if (count >= Math.pow(2, i)) {
        count=count-Math.pow(2, i);
        permissions.push(Math.pow(2, i));
      }
    }
    return permissions.indexOf(a)>-1;  
  }

}
