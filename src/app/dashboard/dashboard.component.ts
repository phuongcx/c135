import { Component, OnInit } from '@angular/core';
import { WebAPIService } from 'src/app/service/web-api.service';

declare var Chart:any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
    //count the number of role, user and log
    roleCount:number=0;
    userCount:number=0;
    logCount:number=0;
    newsCount:number=0;

    //All Data of logs
    LogOverview;
    Logs;

    //Percent of Log Data
    openPercent:number=0;
    processPercent:number=0;
    donePercent:number=0;

    //Daily log
    Labels=[];
    Data=[];

    /**
     * Get total of users, logs and roles
     */
    GetCountTotal():void{
        this._service.FetchAll('Logs/GetCountTotal').subscribe(x=>{
            this.userCount=x[0].TotalUsers;
            this.logCount=x[0].TotalLogs;
            this.roleCount=x[0].TotalRoles;
        });
    }

    /**
     * Get log overview
     */
    GetAllLog():void{
        this._service.FetchAll('logs/GetLogOverview').subscribe(x=>{
            /*Process the LOG DATA */
            this.LogOverview=x;//this.LogOverview now have all logs
        });
    }
    
    /**
     * Count percent of logs and process the chart
     */
    CountPercent():void{
        this._service.FetchAll('logs/').subscribe(x=>{
            /*Process the LOG DATA */
            this.Logs=x;//this.Logs now have all logs

            //classify open logs, process logs and done logs
            var openCount=0;
            var processCount=0;
            var doneCount=0;

            //Do with each item in logs
            this.Logs.forEach(i => {
                //Count every specific logs
                if(i.Status=='Open'){
                    openCount++;
                }
                else if(i.Status=='Processing') {
                    processCount++;
                }
                else{
                    doneCount++;
                }

                /** LOG DATA PHASE PROCESS*/
                var dateString = new Date(i.CreateDate);//Convert CreateDate from database to Date type (default: string)
                var dateNow=new Date();//Get the current Date

                //Check if they have same date, we will increase the news
                if(dateString.getDate() == dateNow.getDate() 
                && dateString.getMonth() == dateNow.getMonth() 
                && dateString.getFullYear()==dateNow.getFullYear()){
                    this.newsCount++;
                }

                /** DAILY LOG PHASE PROCESS*/
                //Create label X in the chart with format (DD/MM)
                var label = dateString.getDate()+"/"+(dateString.getMonth()+1);//Month increase 1 because the started from 0
                var countLabel = 0;

                //Now we will check if the label is existing before
                //If not, we will add to the chart
                if(this.Labels.indexOf(label)==-1){
                    this.Labels.push(label);//Add label to chart

                    //We create new loop to count every log in this date
                    this.Logs.forEach(j => {
                        var dateSubString=new Date(j.CreateDate);//Convert CreateDate
                        var dateLabel = dateSubString.getDate()+"/"+(dateSubString.getMonth()+1);//Format (DD/MM)
                        
                        //If they have the same date, we will increase the counter
                        if(dateLabel===label){
                            countLabel++;
                        }
                    });

                    //Add the counter we counted before to Y axis of Chart
                    this.Data.unshift(countLabel);
                }

                //Limit show to the chart to 5
                if(this.Labels.length>5){
                    this.Labels.slice(0,5);
                    this.Data.slice(0,5);
                }

                //Draw chart
                this.DrawChart();

            });

            //Calculate the percent of logs (open, process, done)
            var allLogs=openCount+processCount+doneCount;
            this.openPercent=(openCount*100)/allLogs;
            this.processPercent=(processCount*100)/allLogs;
            this.donePercent=(doneCount*100)/allLogs;
        });
    }

    //Draw chart using ChartJS
    DrawChart():void {
        var ctx = (< HTMLCanvasElement >document.getElementById("myChart")).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.Labels,
                datasets: [{
                    label: 'Daily Logs',
                    data: this.Data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    }

    constructor(private _service:WebAPIService){}

    ngOnInit() {
        //Count total of users, logs, roles
        this.GetCountTotal();

        //show all overview logs
        this.GetAllLog();

        //Count percents of logs
        this.CountPercent();
    }

}