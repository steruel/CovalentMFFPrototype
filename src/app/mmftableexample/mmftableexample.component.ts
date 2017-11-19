import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ViewContainerRef, QueryList } from '@angular/core';
import {
  TdDataTableService, TdDataTableSortingOrder, ITdDataTableSortChangeEvent, ITdDataTableColumn, TdDataTableComponent,
  ITdDataTableSelectEvent, ITdDataTableRowClickEvent, IPageChangeEvent, TdPagingBarComponent, TdDataTableRowComponent,
} from '@covalent/core';
import { Title } from '@angular/platform-browser';
import { DataService } from '../dataservice/data.service';

const DECIMAL_FORMAT: (v: any) => any = (v: number) => v.toFixed(2);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'qs-mmf-tableexample',
  styleUrls: ['./mmftableexample.component.scss'],
  templateUrl: './mmftableexample.component.html',
  viewProviders: [ DataService ],
})

export class MMFTableExampleComponent implements OnInit {
  @ViewChild('dataViewtable') dataViewtable: TdDataTableComponent;
  @ViewChild('pagingBar') pagingBar: TdPagingBarComponent;

  columns: ITdDataTableColumn[] = [
    { name: 'first_name', label: 'First Name', sortable: true }, // , width: 150 },
    { name: 'last_name', label: 'Last Name', filter: true },
    { name: 'gender', label: 'Gender', hidden: false },
    { name: 'email', label: 'Email', sortable: true }, // , width: 250 },
    { name: 'balance', label: 'Balance', numeric: true, format: DECIMAL_FORMAT },
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

  constructor(private _dataTableService: TdDataTableService, private dataService: DataService, private _viewContainerRef: ViewContainerRef) { }
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
    this.dataService.getTableDataFromSQLite('MMFTest', 'customer', 100).subscribe((items: Object[]) => {
        // tslint:disable-next-line:no-console
        console.log('ITEM');
        // tslint:disable-next-line:no-console
        console.log(items);
        // tslint:disable-next-line:typedef
        items.forEach((element) => {
            // tslint:disable-next-line:no-console
            console.log('element');
            // tslint:disable-next-line:no-console
            console.log(element);
            // tslint:disable-next-line:typedef
            this.data.push(element);
        });
        // tslint:disable-next-line:no-console
        this.flag = true;
        this.totalRows = this.data.length ;
        this.selectedRows = this.filteredData.length;
        
        this.filteredData = this.data.slice(0,this.data.length);
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
  ngOnInit(): void {
    this.pagingBar.pageSizes = [this.pageSize];
    this.totalRowsGtZero = false;
    this.getTableData();
    // this.filter();
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
    //this.dataViewtable.value = this.dataViewRows;
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
    // tslint:disable-next-line:no-console
    console.log('EXCLUDED COLUMNS');
    // tslint:disable-next-line:no-console
    console.log(excludedColumns);
    console.log(' NEW DATA BEFORE FILTER : ');
    console.log(newData);
    newData = this._dataTableService.filterData(this.data, this.searchTerm, true, excludedColumns);
    console.log(' NEW DATA AFTER FILTER : ');
    console.log(newData);
    // tslint:disable-next-line:no-console
    //console.log('NEW DATA');
    // tslint:disable-next-line:no-console
    //console.log(newData);
    newData = this._dataTableService.sortData(newData, this.sortBy, this.sortOrder);
    // tslint:disable-next-line:no-console
    console.log('NEW DATA after sorting:' + newData);
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
}
