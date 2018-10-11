import { Component, OnInit } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss']
})
export class RoleDetailsComponent implements OnInit {
  rid: number;
  constructor(private _service: WebAPIService, private router: ActivatedRoute) {
  }
  roleDetails;
  userRoles;
  newRole;
  permissionValue;


  ngOnInit() {
    this.router.params.subscribe(params => {
      this.rid = +params['id'];
    });
    this.GetRoledata(this.rid);
  }

  GetRoledata(id) {
    this._service.GetDetails('roles',id).subscribe(x => {
      this.roleDetails = x[0];
      this.userRoles = x;
    });
  }

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

  onSubmit(formEditRole, rid) {
    this.newRole = formEditRole.value;
    this.newRole.Permissions = this.GetPermission();
    this.newRole.RoleId = rid;
    this.UpdateRoles();
  }

  private GetPermission() {
    var permission = 0;
    $('#checkboxes input:checked').each(function () {
      permission += parseInt($(this).attr('name'));
    });
    return permission;
  }
  
  private UpdateRoles() {
    this._service.Update('roles',this.newRole).subscribe
      (success => {
        this.GetRoledata(this.rid);
        $('#EditRoleModal').modal('hide');
      });
  }

}
