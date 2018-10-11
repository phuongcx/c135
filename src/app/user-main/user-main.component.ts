import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { WebAPIService } from 'src/app/service/web-api.service';


declare var $: any;
@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.scss'],
})
export class UserMainComponent implements OnInit,OnDestroy {
  private httpSubscription: Subscription = new Subscription();
  private filter;
  private filteredOption;
  private p: number = 1;
  private myControl = new FormControl();


  constructor(private _service: WebAPIService) { }
  users;
  usernamePicked;
  userIdPicked;
  roles;
  newUser;

  getUserPicked(usn, uid) {
    this.usernamePicked = usn;
    this.userIdPicked = uid;
  }

  private _filter(value: string): string {
    const filterValue = value.toLowerCase();
    return this.users.filter(result => result['FullName'].toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.GetAllUsers();
    this._service.FetchAll('roles').subscribe(x => this.roles = x);
    this.filteredOption = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length > 0 ? this._filter(value.toString()) : []));
  }

  ngOnDestroy(){
    this.httpSubscription.unsubscribe();
  }

  private SearchUser() {

    if(this.myControl.value === '')
    {
      this.GetAllUsers();
    }
    else
    {
      this.httpSubscription.add(this._service.GetDetails('users/search',this.myControl.value)
      .subscribe(result => this.users = result));
    } 
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

  onSubmit(formAdd) {
    this.newUser = formAdd.value;
    this.newUser.RoleId = this.findIdByNameRole(this.newUser.RoleId);
    this.newUser.Gender = this.newUser.Gender === "Male" ? true : false;
    this.AddUsers();
  }

  private AddUsers() {
    this._service.Add('users',this.newUser).subscribe(
      success=>this.GetAllUsers()
    );
  }

  private GetAllUsers() {
    this._service.FetchAll('users').subscribe(data => this.users = data);
  }

  public DeleteUser(id) {
    this._service.Delete('users',id).subscribe(
      success => {
        this.GetAllUsers();
      });
  }
}
