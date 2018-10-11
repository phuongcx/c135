import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-log-main',
  templateUrl: './log-main.component.html',
  styleUrls: ['./log-main.component.scss'],
})
export class LogMainComponent implements OnInit, OnDestroy {
  public LogIdPicked;
  private logTypeNgModel = 'Info';
  private statusNgModel = 'Open';
  private descriptionNgModel;
  private logs;
  private filterSearch;
  private filteredOption;
  private dataSearch: string = '';
  private myControl = new FormControl();
  private userID = localStorage.getItem('userID');
  private pageSize: number = 10;
  private pageNumber;
  private pageArray = [];
  private currentPage: number;
  private httpSubscription: Subscription = new Subscription();

  constructor(private _service: WebAPIService) {
  }

  ngOnInit() {
    this.PageInit();
    this.GetAllLogForSearch();
    this.filteredOption = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length > 0 ? this.Filter(value.toString()) : []));
  }

  ngOnDestroy() {
    this.httpSubscription.unsubscribe();
  }

  private setId(id) {
    this.LogIdPicked = id;
  }

  private Filter(value: string): string {
    const filterValue = value.toLowerCase();
    return this.filterSearch.filter(result => result.toLowerCase().includes(filterValue));
  }

  private GetAllLogForSearch() {
    this.httpSubscription.add(this._service.FetchAll('Logs/GetAllLogForSearch')
      .subscribe(result => this.filterSearch = result));
  }

  private SearchLog() {
    this.dataSearch = this.myControl.value;
    if (this.dataSearch === '') {
      this.PageInit();
    }
    else {
      this.currentPage = 1;
      this.RefeshePageArray();
      this.GetLogsForPagination();
    }
  }

  private OnSubmit(formAddLog) {
    if (!formAddLog.invalid) {
      this.httpSubscription.add(this._service.Add('Logs/' + this.userID, formAddLog.value)
        .subscribe(result => {
          this.PageInit();
          $('#logName').val('');
          this.logTypeNgModel = 'Info';
          this.statusNgModel = 'Open'
          this.descriptionNgModel = '';
          $('#CreateLogModal').modal('hide');
        }));
    }
  }

  private DeleteLog(logID) {
    this.httpSubscription.add(
      this._service.Delete('Logs', logID)
        .subscribe(success => {
          this.RefeshePageArray();
        }));
  }

  private RefeshePageArray() {
    if (this.dataSearch === '') {
      this.httpSubscription.add(this._service.FetchAll('Logs/GetCountTotal')
        .subscribe(result => {
          this.pageNumber = (result[0].TotalLogs % this.pageSize === 0 ? result[0].TotalLogs / this.pageSize : parseInt((result[0].TotalLogs / this.pageSize) + 1 + ""));
          this.pageArray = [];

          if (this.currentPage == 1) {
            for (let i = 1; i <= this.pageNumber && i <= 5; i++) {
              this.pageArray.push(i)
            }
          }
          else if (this.currentPage >= this.pageNumber) {
            this.currentPage = this.pageNumber;
            for (let i = this.pageNumber; i >= this.pageNumber - 4 && i > 0; i--) {
              this.pageArray.unshift(i)
            }
          }
          else {
            for (let i = this.pageNumber; i >= this.pageNumber - 4 && i > 0; i--) {
              this.pageArray.unshift(i)
            }
          }
          this.GetLogsForPagination();
        }));
    }
    else {
      this.httpSubscription.add(this._service.FetchAll('Logs/CountResultSearch/' + this.dataSearch)
        .subscribe(result => {
          let countResult: number = parseInt(result + "");
          this.pageNumber = (countResult % this.pageSize === 0 ? countResult / this.pageSize : parseInt((countResult / this.pageSize) + 1 + ""));
          this.pageArray = [];

          if (this.currentPage == 1) {
            for (let i = 1; i <= this.pageNumber && i <= 5; i++) {
              this.pageArray.push(i)
            }
          }
          else if (this.currentPage >= this.pageNumber) {
            this.currentPage = this.pageNumber;
            for (let i = this.pageNumber; i >= this.pageNumber - 4 && i > 0; i--) {
              this.pageArray.unshift(i)
            }
          }
          else {
            for (let i = this.pageNumber; i >= this.pageNumber - 4 && i > 0; i--) {
              this.pageArray.unshift(i)
            }
          }
          this.GetLogsForPagination();
        }));
    }
  }

  private PageInit() {
    this.currentPage = 1;
    this.RefeshePageArray();
    this.GetLogsForPagination();
  }

  private ClickFirstPage() {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.RefeshePageArray();
      this.GetLogsForPagination();
    }
  }

  private ClickPreviousPage() {
    if (this.currentPage > 1) {
      if (this.pageArray.indexOf(this.currentPage) == 0) {
        this.pageArray.pop();
        this.pageArray.unshift(this.currentPage - 1);
      }
      this.currentPage--;
      this.GetLogsForPagination();
    }
  }

  private ClickNextPage() {
    if (this.currentPage < this.pageNumber) {
      if (this.pageArray.indexOf(this.currentPage) == 4) {
        this.pageArray.shift();
        this.pageArray.push(this.currentPage + 1);
      }
      this.currentPage++;
      this.GetLogsForPagination();
    }
  }

  private ClickLastPage() {
    if (this.currentPage < this.pageNumber) {
      this.currentPage = this.pageNumber;
      this.RefeshePageArray();
      this.GetLogsForPagination();
    }
  }

  private ClickPageNumber(pageClicked: number) {
    if (pageClicked != this.currentPage) {
      this.currentPage = pageClicked;
      this.GetLogsForPagination();
    }
  }

  private GetLogsForPagination() {
    if (this.dataSearch === '') {
      this.httpSubscription.add(this._service.GetAllWithSkips('Logs/GetAllLogForPagination', (this.currentPage - 1) * this.pageSize, this.pageSize)
        .subscribe(result => this.logs = result));
    }
    else {
      this.httpSubscription.add(this._service.GetAllWithSkips('Logs/Search/' + this.dataSearch, (this.currentPage - 1) * this.pageSize, this.pageSize)
        .subscribe(result => this.logs = result));
    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '25px'
  };
}