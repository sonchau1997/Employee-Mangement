import { Component, OnInit, ViewChild, TemplateRef, } from '@angular/core';
import { SalaryService } from '../../../services/salary.service';
import { ApiService } from '../../../services/api.service';
import { Paging } from '../../../models/paging';
import { SalaryHistory } from '../../../models/salary-history';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-salary-counting',
  templateUrl: './salary-counting.component.html',
  styleUrls: ['./salary-counting.component.css']
})
export class SalaryCountingComponent implements OnInit {

  salaryHistories: SalaryHistory[] = [];
  paging = { page: 1, pageLimit: 10, totalItems: 10 } as Paging;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
  message = '';
  notifyModalRef: BsModalRef;
  @ViewChild('notifyModalTemplate') public notifyModalTemplate: TemplateRef<any>;


  constructor(
    private salaryService: SalaryService, private apiService: ApiService, private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.loadSalaryHistories();
  }

  loadSalaryHistories(page = null,) {
    if (page != null) {
      this.paging.page = page.offset;
    }
    // lưu ý khi tạo đối tượng date thì month truyền vào bị trừ đi 1
    this.salaryService.histories(this.paging, new Date(this.year, this.month, 0)).subscribe(res => {
      this.salaryHistories = res.data;
      console.log(this.salaryHistories);
      this.paging = res.paging;
    });
  };

  countSalary() {
    this.salaryService.count({ month: this.month, year: this.year }).subscribe(
      res => {
        this.message = res.message;
        this.notifyModalRef = this.modalService.show(this.notifyModalTemplate);
        this.loadSalaryHistories();
        // location.reload();
      },
      err => {
        console.log(err);
        this.message = err.error.Message;
        this.notifyModalRef = this.modalService.show(this.notifyModalTemplate);
      });
  }

  selectMonth(value) {
    this.month = value;
    console.log('this.month' + this.month);
    this.loadSalaryHistories();
  }

  selectYear(value) {
    this.year = value;
    console.log('this.year' + this.year);
    this.loadSalaryHistories();
  }

}

// link tai lieu
// stackoverflow.com/questions/41880420/how-to-get-templateref-of-a-component-in-angular2