import { Component, OnInit } from '@angular/core';
import { IConnectResponse } from 'src/app/api/models/device.model';
import { IGetReportsDashboardResponse, IHistoryTestGroupScores, IResultReport } from 'src/app/api/models/report.model';
import { ReportsService } from 'src/app/api/services/reports.service';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDate:string = ToolUtils.FormatFullDate(new Date().toString());
  resultReports!:IResultReport;

  groupScore1!:IHistoryTestGroupScores;
  groupScore2!:IHistoryTestGroupScores;
  groupScore3!:IHistoryTestGroupScores;
  groupScore4!:IHistoryTestGroupScores;
  groupScore5!:IHistoryTestGroupScores;
  groupScore0!:IHistoryTestGroupScores;

  constructor(private reportsService:ReportsService) { }

  ngOnInit(): void {
    this.reportsService.GetDashboard().subscribe((res:IGetReportsDashboardResponse) => {
      if(res?.success)
      {
        this.resultReports = res.result;

        this.groupScore1 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 0);
        this.groupScore2 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 1);
        this.groupScore3 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 2);
        this.groupScore4 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 3);
        this.groupScore5 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 4);
        this.groupScore0 = <IHistoryTestGroupScores>this.resultReports.history_test_group_scores.find(s => s.score == 5);
      }
      else{
        Swal.fire({
          title: `Error!!! Get Reports dashboard`,
          text: res?.message,
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    });
  }


}
