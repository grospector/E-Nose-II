import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITestDetail, ITestDetailResponse } from 'src/app/api/models/test.model';
import { TestsService } from 'src/app/api/services/tests.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultComponent {
  id: number = 0;
  testDetail!:ITestDetail;
  levelScoreClass:string = "bg-lv0";
  levelTextScoreClass:string = "text-lv0";
  textLevel:string = "";

  constructor(private route: ActivatedRoute
              ,private testsService: TestsService) {}

  ngOnInit() {
    
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.testsService.GetTestDetail(this.id).subscribe((res:ITestDetailResponse) => {
      if(res?.success)
      {
        this.testDetail = res.test;

        this.checkLevelScore(this.testDetail.score);
      }
      else{
        Swal.fire({
          title: `Error!!! Test Detail don't response`,
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

  checkLevelScore(score:number) : void {
    switch(score)
    {
      // case 0:
      case 1:
      case 2:
      default:
        this.levelScoreClass = "bg-lv1";
        this.levelTextScoreClass = "text-lv1";
        this.textLevel = "มีความเสี่ยงในระดับ ต่ำ";
        break;
      case 3:
      case 4:
        this.levelScoreClass = "bg-lv2";
        this.levelTextScoreClass = "text-lv2";
        this.textLevel = "มีความเสี่ยงในระดับ ปานกลาง";
        break;
      case 5:
        this.levelScoreClass = "bg-lv3";
        this.levelTextScoreClass = "text-lv3";
        this.textLevel = "มีความเสี่ยงในระดับ สูง";
        break;
    }
  }
  
}


