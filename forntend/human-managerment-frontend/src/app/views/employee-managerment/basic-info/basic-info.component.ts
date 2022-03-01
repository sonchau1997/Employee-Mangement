import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Employee } from '../../../models/employee';
import { Job } from '../../../models/job';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { ExcelService } from '../../../services/excel.service';
import { Paging } from '../../../models/paging';
import { EmployeeService } from '../../../services/employee.service';
import { JsonPipe } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { DegreeService } from '../../../services/degree.service';


@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('addModal', { static: false }) addModal: ModalDirective;
  @ViewChild('materialModal', { static: false }) materialModal: ModalDirective;

  columns = [
    { name: 'Tên', prop: 'firstname ', sortTable: true },
    { name: 'Lương cơ bản', prop: 'salary', sortTable: true },
    { name: 'Email', sortTable: true },
    { name: 'Địa chỉ', sortTable: true },
  ];
  image: File;
  saveForm: FormGroup;
  genders = [{ value: true, name: 'Nam' }, { value: false, name: 'Nữ' }];
  action: string;
  employees: Employee[] = [];
  employee: Employee = { id: 0 } as Employee;
  paging = { page: 0, pageLimit: 10, totalItems: 3 } as Paging;
  img: any = 'https://screenshotlayer.com/images/assets/placeholder.png';
  empImgPath: any = this.apiService.apiUrl.employees.images;
  imgName: string = 'Choose file';
  public imagePath;
  public job: any;
  degreeImage = '';
  degreeImagePath = this.apiService.apiUrl.employees.degreeImages;
  degreeFile :File;


  choosedEmp: Employee = {
    id: 0,
    firstname: '',
    lastname: '',
    birthDay: null,
    gender: true,
    email: '',
    phoneNumber: '',
    hireDay: null,
    jobLevel: 0,
    imageName: '',
    job: null,
    degrees: null,
  };

  addDegreeModalRef: BsModalRef;
  @ViewChild('addDegreeModal') public addDegreeModal: TemplateRef<any>;

  constructor(
    private http: HttpClient, private excelService: ExcelService, private employeeService: EmployeeService, private degreeService: DegreeService,
    private apiService: ApiService, private fb: FormBuilder,private modalService: BsModalService) {
    this.saveForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      birthDay: [''],
      gender: [''],
      email: [''],
      phoneNumber: [''],
      hireDay: [''],
      salary: [''],
      file: ['']
    });
  }
  

  ngOnInit(): void {
    this.loadEmployee();

  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }

  loadEmployee(page = null) {
    // if (page != null) {
    //   this.paging.page = page.offset;
    // }
    this.employeeService.list(this.paging).subscribe(res => {
      this.employees = res.data;
      this.paging = res.paging;
    });
  };


  choose(row) {
    console.log(row);

    this.choosedEmp = row;
  }

  showAddModal() {
    this.action = 'ADD';
    this.addModal.show();


  }

  selectFile(event) {
    this.image = event.target.files.item(0);
    console.log(this.image);

  }

  save() {
    console.log(this.employee);
    if (this.action == 'ADD') {
      this.employeeService.addEmployee(this.image, this.employee).subscribe(res => {
        console.log(res);
        this.loadEmployee(null);
    });
    this.hideModal();
  }
}

  hideModal() {
    this.imgName = 'Choose file';
    this.img = 'https://screenshotlayer.com/images/assets/placeholder.png';
    this.addModal.hide();
  }

  exportAsXLSX() {
    this.excelService.exportAsExcelFile(this.employees, 'DSNV');
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    this.imgName = files[0].name;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.img = reader.result;

    }
  }

  changeDegree(imageName) {
    console.log('da vao');
    this.degreeImage = imageName;
  }

  addDegree(file: File, degreeTypeId: number, employeeId: number) {
    this.degreeService.addDegree(file,degreeTypeId,employeeId).subscribe(res => {
      console.log(res);
      this.ngOnInit;
    });
  }

  openDegreeModal(){
    this.addDegreeModalRef = this.modalService.show(this.addDegreeModal);
  }

  selectDegreeFile(event) {
    this.degreeFile = event.target.files.item(0);
    console.log(this.image);

  }
}
