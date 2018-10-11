import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss'],
})
export class LogDetailsComponent implements OnInit, OnDestroy {

  private logDetails;
  private userlogs;
  private descriptionNgModel;
  private tempDescriptionNgModel;
  private logID;
  private userID = localStorage.getItem('userID');
  private httpSubscription: Subscription = new Subscription();
  private paramSubscription: Subscription = new Subscription();

  constructor(
    private _service: WebAPIService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.GetLogByID();
  }

  ngOnDestroy(){
      this.httpSubscription.unsubscribe();
      this.paramSubscription.unsubscribe();
  }

  private GetLogByID() {
    this.paramSubscription = this.activatedRouter.params.subscribe(params => this.logID = params['id']);
    if(!isNaN(Math.round(this.logID)))
    {
      this.httpSubscription.add(this._service.GetDetails('Logs',this.logID)
      .subscribe(result => {
        if (result) {
          this.logDetails = result[0];
          this.tempDescriptionNgModel = result[0].Description;
        }
        else {
          this.router.navigate(['/not-found']);
        }
      }));
      this.httpSubscription.add(this._service.GetDetails('UserLogs',this.logID)
      .subscribe(result => {
        this.userlogs = result;
      }));
    }
    else
    {
      this.router.navigate(['/not-found']);
    }
  }

  private InitalDescriptionNgModel() {
    this.descriptionNgModel = this.tempDescriptionNgModel;
  }

  private OnSubmit(formEditLog) {
    var NewLog = formEditLog.value;
    NewLog.LogID = this.logID;
    this.httpSubscription.add(this._service.Update('Logs/'+this.userID, NewLog)
    .subscribe(result => { 
      this.GetLogByID(); 
      $('#EditLogModal').modal('hide');
    }));
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '25px'
  };
}
