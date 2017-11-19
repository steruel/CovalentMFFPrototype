import { Component, OnInit } from '@angular/core';
import { TdDigitsPipe } from '@covalent/core';
import { Title } from '@angular/platform-browser';

import { DataService } from '../dataservice/data.service';

@Component({
  selector: 'qs-mmf-graphexample',
  styleUrls: ['./mmfgraphexample.component.scss'],
  templateUrl: './mmfgraphexample.component.html',
})
export class MMFGraphExampleComponent implements OnInit {

  // Chart
//  single: any[];
//  multi: any[];
  single: any ;
  multi: any ;
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = '';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Sales';

  colorScheme: any = {
    domain: ['#1565C0', '#03A9F4', '#FFA726', '#FFCC80'],
  };

  // line, area
  autoScale: boolean = true;
  constructor(private dataService: DataService) {
  }

  // ngx transform using covalent digits pipe
  axisDigits(val: any): any {
    return new TdDigitsPipe().transform(val);
  }
  getSingle(): void {
    // tslint:disable-next-line:typedef
    this.single = this.dataService.getSingle();
  }
  getMulti(): void {
    // tslint:disable-next-line:typedef
    this.multi = this.dataService.getMulti();
  }
  ngOnInit(): void {
    this.getSingle();
    this.getMulti();
    // Chart Single
    Object.assign(this, this.single);
    // Chart Multi
    this.multi = this.multi.map((group: any) => {
      group.series = group.series.map((dataItem: any) => {
        dataItem.name = new Date(dataItem.name);
        return dataItem;
      });
      return group;
    });
  }
}
