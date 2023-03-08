import { Component, OnInit } from '@angular/core';
import { IConnectResponse } from 'src/app/api/models/device.model';
import { ITestsGetListResponse } from 'src/app/api/models/test.model';
import { TestsService } from 'src/app/api/services/tests.service';
import { ToolUtils } from 'src/app/core/common/tool.utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss']
})
export class TestReportComponent implements OnInit {
  loading:boolean = true;
  tests!:any[];

  displayModalResult:boolean = false;
  testResultUrl:string = "";

  inputSearch:string = "";

  limitRow:number = 10;
  totalRecords!:number;

  constructor(private testsService:TestsService) { }

  ngOnInit(): void {
    this.FetchGetListTests(0);
  }

  onClickView(testId:number)
  {
    const routeUrl = "result?id="+testId.toString();
    this.testResultUrl = ToolUtils.FormatUrl(routeUrl);

    this.displayModalResult = true;
  }

  
  isCopiedToClipboard:boolean = false;

  onClickClipboard() : void{
    document.addEventListener('copy', (e: ClipboardEvent) => {
      if(e.clipboardData)
      {
        e.clipboardData.setData('text/plain', (this.testResultUrl));
        e.preventDefault();
        //document.removeEventListener('copy', null);

        this.isCopiedToClipboard = true;

        let timer: ReturnType<typeof setTimeout> = setTimeout(() => { 
          clearTimeout(timer);

          this.isCopiedToClipboard = false;
         }, 5*1000);

      }
    });
    document.execCommand('copy');
  }

  FetchGetListTests(offset:number) : void{
    this.loading = true;
    this.testsService.GetListTests(this.inputSearch,offset,this.limitRow).subscribe((res:ITestsGetListResponse) =>{
      if(res?.success)
      {
        this.totalRecords = res.count_total;
        this.tests = res.tests;
        this.loading = false;
      }
      else{
        this.loading = false;
        Swal.fire({
          title: `Error!!! Test get list that don't response`,
          text: res?.message,
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: 'OK'
        }).then(
          (result) => {
          }
        );
      }
    });
  }

  public FormatFullDate(date:string){
    return ToolUtils.FormatFullDate(date);
  }
}
