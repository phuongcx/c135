import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebAPIService } from 'src/app/service/web-api.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})

export class UserDetailsComponent implements OnInit {

  constructor(private _service: WebAPIService, private router: ActivatedRoute) {
  }
  uid: number;
  userDetails;
  roles;
  newUser;
  userLog;

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.uid = +params['id'];
    });
    this.GetUserdata(this.uid);
    this._service.FetchAll('roles').subscribe(data => this.roles = data);
  }

  GetUserdata(id) {
    this._service.GetDetails('users',id).subscribe(x => {
      this.userDetails = x[0];
      this.userLog = x;
    });
  }

  findIdByNameRole(roleNameSelected): number {
    var t = -1;
    this.roles.forEach(e => {
      if (e.RoleName == roleNameSelected) {
        t = e.RoleId;
      }
    });
    return t;
  }
  
  onSubmit(formEdit, uid) {
    this.newUser = formEdit.value;
    this.newUser.RoleId = this.findIdByNameRole(this.newUser.RoleId);
    this.newUser.Gender = this.newUser.Gender === "Male" ? true : false;
    this.newUser.UserId = uid;
    this.UpdateUsers(uid);
  }

  private UpdateUsers(uid) {
    this._service.Update('users',this.newUser).subscribe
      (success => this.GetUserdata(uid));
  }
}
