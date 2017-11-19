import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ViewContainerRef, QueryList } from '@angular/core';
import {
  TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdDataTableComponent,
  ITdDataTableSelectEvent, ITdDataTableRowClickEvent, IPageChangeEvent, TdPagingBarComponent, TdDataTableRowComponent,
} from '@covalent/core';
import { CovalentDynamicFormsModule, ITdDynamicElementConfig, TdDynamicElement, TdDynamicFormsComponent, } from '@covalent/dynamic-forms';
import { Title } from '@angular/platform-browser';
import { DataService } from '../dataservice/data.service';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpInterceptorService } from '@covalent/http';
import {  TdDialogService } from '@covalent/core';

//import {MatDatepickerModule} from '@angular/material'; 
 
const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'qs-mmf-projdeclaration',
  styleUrls: ['./projdeclaration.component.scss'],
  templateUrl: './projdeclaration.component.html',
  viewProviders: [ DataService ],
})

export class ProjDeclarationComponent implements OnInit {
  @ViewChild('dataViewtable') dataViewtable: TdDataTableComponent;
  @ViewChild('pagingBar') pagingBar: TdPagingBarComponent;
  @ViewChild('firstBlock')  _firstBlock: TdDynamicFormsComponent;
  @ViewChild('secondBlock')  _secondBlock: TdDynamicFormsComponent;
  
  columns: ITdDataTableColumn[] = [
    { name: 'id_project', label: 'ID Project', sortable: true }, // , width: 150 },
    { name: 'name_project', label: 'Project Name', filter: true },
    { name: 'name_responsible', label: 'Responsible', hidden: false },
    { name: 'open_date', label: 'Open Date', sortable: true }, // , width: 250 },
    { name: 'close_date', label: 'Close Date', sortable: true },
  ];
  textElements: ITdDynamicElementConfig [] = [
    {
      name: 'IDProject',
      label: 'ID Project',
      type: TdDynamicElement.Input,
      required: true,
    },
    {
      name: 'ProjectName',
      label: 'Project Name',
      type: TdDynamicElement.Input,
      required: true,
    },
    {
      name: 'ProjectDescription',
      label: 'Project Description',
      type: TdDynamicElement.Input,
      required: false,
      min: 4,
      max: 12,
    },
    {
      name: 'ProjectPath',
      label: 'Project Path',
      type: TdDynamicElement.Input,
      required: true,
      min: 4,
      max: 12,
    },
    {
      name: 'ProjectResponsible',
      label: 'Project Responsible',
      type: TdDynamicElement.Select,
      required: true,
      selections: [
        'Madan',
        'Pranay',
        'Sergio',
      ],
      default: 'Pranay',
    },
  ];
  dateElements: ITdDynamicElementConfig [] = [
    {
      name: 'OpenDate',
      label: 'Open Date',
      type: TdDynamicElement.Input,
      required: true,
    },
    {
      name: 'CloseDate',
      label: 'Close Date',
      type: TdDynamicElement.Input,
      required: false,
    },
    {
      name: 'Active',
      label: 'Active',
      type: TdDynamicElement.Checkbox,
      required: false,
    },
  ];
  
  data: any[] = [];
  filteredData: any[] = [];
  dataView: any[] = [];
  dataColumn: any[] = [];
  totalRows: number = 0;
  selectedRows: number = 0;
  totalRowsGtZero: Boolean = false;
  currentPage: number = 1;
  pageSize: number = 6;
  flag: boolean = false;

  filteredTotal: number = 10;

  searchTerm: string = '';
  fromRow: number = 1;
  sortBy: string = 'first_name';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;

  // tslint:disable-next-line:max-line-length
  constructor(private _http: HttpInterceptorService, private _dataTableService: TdDataTableService, private dataService: DataService, 
      private _viewContainerRef: ViewContainerRef, private _dialogService: TdDialogService) { }
  getTableData(): void {
    this.data = [];
    this.dataColumn = [];
    this.totalRows = 0;
    this.selectedRows = 0;
    this.totalRowsGtZero = false;
    this.flag = false;
    let count: number = 0;

    // tslint:disable-next-line:no-console
    console.log(this.data);
    this.dataService.getTableDataFromSQLite('MMFTest', 'project_declarations', 100).subscribe((items: Object[]) => {
        // tslint:disable-next-line:no-console
        console.log('ITEM');
        // tslint:disable-next-line:no-console
        console.log(items);
        // tslint:disable-next-line:typedef
        items.forEach((element) => {
            // tslint:disable-next-line:typedef
            this.data.push(element);
        });
        // tslint:disable-next-line:no-console
        this.flag = true;
        this.totalRows = this.data.length ;
        this.selectedRows = this.filteredData.length;
        this.filteredData = this.data.slice(0,this.data.length);
        this.filteredTotal = this.filteredData.length;
        this.dataView = this.filteredData.slice(0,this.pageSize);
        // tslint:disable-next-line:no-console
        console.log('FLAG :' + this.flag);
        this.dataViewtable.refresh();
    });

    // tslint:disable-next-line:no-console
    console.log('DATA:' + this.data);
    this.dataColumn = this.columns;
    // tslint:disable-next-line:no-console
    console.log('Columns: ' + this.dataColumn);
  }
  // tslint:disable-next-line:typedef
  insert_project() {
    // tslint:disable-next-line:typedef
    let is_active = this._secondBlock.dynamicForm.get('Active').value;
    if( is_active == 'None'){
      is_active = 'False';
    }

    let id_project = this._firstBlock.dynamicForm.get('IDProject').value;
    let name_project = this._firstBlock.dynamicForm.get('ProjectName').value;
    let desc_project = this._firstBlock.dynamicForm.get('ProjectDescription').value;
    let path_project = this._firstBlock.dynamicForm.get('ProjectPath').value;
    let name_responsible = this._firstBlock.dynamicForm.get('ProjectResponsible').value;
    let open_date = this._secondBlock.dynamicForm.get('OpenDate').value;
    let close_date = this._secondBlock.dynamicForm.get('CloseDate').value;
    if( (id_project === null) || (name_project === null) || (path_project === null) || (name_responsible === null) || (open_date === null)
        || (id_project === '') || (name_project === '') || (path_project === '') || (name_responsible === '') || (open_date === '')){
        this.openAlert('There are empty mandatory data. Please correct it and try again.');
    }else{
      let body = {'dbname': 'MMFTest',
                  'tablename': 'project_declarations',
                  'id_project': this._firstBlock.dynamicForm.get('IDProject').value,
                  'name_project': this._firstBlock.dynamicForm.get('ProjectName').value,
                  'desc_project': this._firstBlock.dynamicForm.get('ProjectDescription').value,
                  'path_project': this._firstBlock.dynamicForm.get('ProjectPath').value,
                  'id_responsible': 1,
                  'name_responsible': this._firstBlock.dynamicForm.get('ProjectResponsible').value,
                  'open_date': this._secondBlock.dynamicForm.get('OpenDate').value,
                  'close_date': this._secondBlock.dynamicForm.get('CloseDate').value,
                  'is_active': is_active };

      this.dataService.insert_project(body).subscribe((items: Object[]) => {
        this.getTableData();
    });
    }
  }
  // tslint:disable-next-line:typedef
  delete_project(idProject: string) {
    // tslint:disable-next-line:typedef
    let body = {'dbname': 'MMFTest',
                'tablename': 'project_declarations',
                'id_project': idProject};
    this.dataService.delete_project(body).subscribe((items: Object[]) => {
        this.getTableData();
    });
  }
  ngOnInit(): void {
    this.pagingBar.pageSizes = [this.pageSize];
    this.totalRowsGtZero = false;
    this.getTableData();
  }

  sort(sortEvent: ITdDataTableSortChangeEvent): void {
    console.log('EVENTO SORT!!!');
    console.log(sortEvent);
    this.sortBy = sortEvent.name;
    this.sortOrder = sortEvent.order;
    this.filter();
  }

  search(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.filter();
  }

  page(event: IPageChangeEvent): void {
    let page: number = event.page;
    let pageSize: number = this.pageSize;
    let fromRecord: number = page * pageSize - pageSize;
    let toRecord: number = fromRecord + pageSize;
    this.flag = false;
    // tslint:disable-next-line:one-line
    if ( toRecord > this.totalRows ){
      toRecord = this.totalRows;
    }
    this.currentPage = page;
     // tslint:disable-next-line:no-console
    console.log('page: ' + page);
    // tslint:disable-next-line:no-console
    console.log(fromRecord + ' to ' + toRecord);
    //this.filteredData = this.data.slice(fromRecord, toRecord);
    this.dataView = this.filteredData.slice(fromRecord, toRecord);
    this.flag = true;
    // this.dataViewtable.value = this.dataViewRows;
    this.dataViewtable.refresh();
  }
  filter(): void {
    let newData: any[] = this.data;
    let excludedColumns: string[] = this.columns
      .filter((column: ITdDataTableColumn) => {
        return ((column.filter === undefined && column.hidden === true) ||
          (column.filter !== undefined && column.filter === false));
      }).map((column: ITdDataTableColumn) => {
        return column.name;
      });
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    this.filteredData = newData;
    this.filteredTotal = this.filteredData.length;
    this.selectedRows = this.filteredData.length;
    if (this.selectedRows > 0) {
      this.totalRowsGtZero = true;
    } else {
      this.totalRowsGtZero = false;
    }
    this.dataView = this.filteredData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize );
    this.dataViewtable.refresh();
  }
  submitNewProject(): void {
    this.insert_project();
  }
  submitDeleteProject(): void {
    let selected: TdDataTableRowComponent[]  = this.dataViewtable._rows.toArray();
    let values: any[] = this.dataViewtable.data;
    let index: number = 0;
    let indexSelected: number = -1;
    for (let entry of selected) {
      index++;
      if (entry.selected) {
        indexSelected = index;
      }
    }
    if (indexSelected !== -1) {
      let rowJSON = JSON.stringify(this.filteredData[indexSelected-1]);
      console.log('JSON: ' + rowJSON);
      let first = rowJSON.indexOf('id_project')+12;
      let second;
      if(rowJSON.charAt(first) == '"'){
          first++;
          second = rowJSON.substring(first).indexOf('"');
      }
      else{
          second = rowJSON.substring(first).indexOf(',');
      }
      console.log(first+ ' ' + second);
      let id_project = rowJSON.substr(first,second);
      console.log(id_project);
      this.delete_project(id_project);
    }
  }
  openAlert(text: string): void {
    this._dialogService.openAlert({
      message: text,
      disableClose: false, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: 'Warning', //OPTIONAL, hides if not provided
      closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
    });
  }
}
