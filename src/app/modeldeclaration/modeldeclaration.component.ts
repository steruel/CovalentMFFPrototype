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

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'qs-mmf-modeldeclaration',
  styleUrls: ['./modeldeclaration.component.scss'],
  templateUrl: './modeldeclaration.component.html',
  viewProviders: [ DataService ],
})

export class ModelDeclarationComponent implements OnInit {
  @ViewChild('dataViewtable') dataViewtable: TdDataTableComponent;
  @ViewChild('pagingBar') pagingBar: TdPagingBarComponent;
  @ViewChild('firstBlock')  _firstBlock: TdDynamicFormsComponent;
  @ViewChild('secondBlock')  _secondBlock: TdDynamicFormsComponent;
  @ViewChild('thirdBlock')  _thirdBlock: TdDynamicFormsComponent;
  
  columns: ITdDataTableColumn[] = [
    { name: 'id_model', label: 'ID Model', sortable: true },
    { name: 'id_project', label: 'ID Project', sortable: true }, // , width: 150 },
    { name: 'name_model', label: 'Model Name', filter: true },
    { name: 'algorithm_model', label: 'Algorithm Type', sortable: true },   
    { name: 'name_responsible_model', label: 'Responsible', hidden: false },
    { name: 'open_date_model', label: 'Open Date', sortable: true }, // , width: 250 },
    { name: 'close_date_model', label: 'Close Date', sortable: true },
  ];
  textElements1: ITdDynamicElementConfig [] = [
    {
        name: 'IDModel',
        label: 'ID Model',
        type: TdDynamicElement.Input,
        required: true,
    },
    {
      name: 'IDProject',
      label: 'ID Project',
      type: TdDynamicElement.Input,
      required: true,
    },
    {
        name: 'ModelName',
        label: 'Model Name',
        type: TdDynamicElement.Input,
        required: true,
    },
    {
        name: 'AlgorithmType',
        label: 'Algorithm Type',
        type: TdDynamicElement.Select,
        required: true,
        selections: [
          'Logistic',
          'Decission Tree',
          'Random Forest',
          'Ranger',
          'XGBoost',
        ],
        default: 'Logistic',
      },
  ];
  textElements2: ITdDynamicElementConfig [] = [
    {
      name: 'ModelDescription',
      label: 'Model Description',
      type: TdDynamicElement.Input,
      required: false,
    },
    {
        name: 'ModelPath',
        label: 'Model Path',
        type: TdDynamicElement.Input,
        required: true,
    },
    {
        name: 'ModelResponsible',
        label: 'Model Responsible',
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
    this.dataService.getTableDataFromSQLite('MMFTest', 'model_declarations', 100).subscribe((items: Object[]) => {
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
  insert_model() {
    let is_active: String = this._thirdBlock.dynamicForm.get('Active').value;
    console.log('active: ' + is_active);
    if( is_active === null){
      is_active = 'False';
    }
    
    let id_project = this._firstBlock.dynamicForm.get('IDProject').value;
    let id_model = this._firstBlock.dynamicForm.get('IDModel').value;
    let algorithm_model = this._firstBlock.dynamicForm.get('AlgorithmType').value;
    let name_model = this._firstBlock.dynamicForm.get('ModelName').value;
    let desc_model = this._secondBlock.dynamicForm.get('ModelDescription').value;
    let path_model = this._secondBlock.dynamicForm.get('ModelPath').value;
    let name_responsible_model = this._secondBlock.dynamicForm.get('ModelResponsible').value;
    let open_date_model = this._thirdBlock.dynamicForm.get('OpenDate').value;
    let close_date_model = this._thirdBlock.dynamicForm.get('CloseDate').value;
    if( (id_project === null) || (id_model === null) || (name_model === null) || (algorithm_model === null) || (path_model === null) || (name_responsible_model === null) || (open_date_model === null)
        || (id_project === '') || (id_model === '') || (name_model === '') || (algorithm_model === '') || (path_model === '') || (name_responsible_model === '') || (open_date_model === '')){
        this.openAlert('There are empty mandatory data. Please correct it and try again.');
    }else{
       let body = {'dbname': 'MMFTest',
                  'tablename': 'model_declarations',
                  'id_project': this._firstBlock.dynamicForm.get('IDProject').value,
                  'id_model': id_model,
                  'algorithm_model': id_project,
                  'name_model': name_model,
                  'desc_model': desc_model,
                  'path_model': path_model,
                  'id_responsible_model': 1,
                  'name_responsible_model': name_responsible_model,
                  'open_date_model': open_date_model,
                  'close_date_model': close_date_model,
                  'is_active_model': is_active };
       this.dataService.insert_model(body).subscribe((items: Object[]) => {
       this.getTableData();
    });
    }
  }
  // tslint:disable-next-line:typedef
  delete_model(idModel: string) {
    // tslint:disable-next-line:typedef
    let body = {'dbname': 'MMFTest',
                'tablename': 'model_declarations',
                'id_model': idModel};
    this.dataService.delete_model(body).subscribe((items: Object[]) => {
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
  submitNewModel(): void {
    this.insert_model();
  }
  submitDeleteModel(): void {
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
        let first = rowJSON.indexOf('id_model')+10;
        let second;
        if(rowJSON.charAt(first) == '"'){
            first++;
            second = rowJSON.substring(first).indexOf('"');
        }
        else{
            second = rowJSON.substring(first).indexOf(',');
        }
        console.log(first+ ' ' + second);
        let model = rowJSON.substr(first,second);
        console.log(model);
        this.delete_model(model);
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
