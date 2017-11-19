import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'qs-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  routes: Object[] = [{
      title: 'Model Framework Introduction',
      route: '/mmfintro',
      icon: 'info',
    }, 
    {
      title: 'Project Declaration',
      route: '/projdeclaration',
      icon: 'folder',
    },{
      title: 'Model Declaration',
      route: '/modeldeclaration',
      icon: 'filter_none',
    },{
      title: 'Model Elements',
      route: '/modelelements',
      icon: 'view_comfy',
    }, {
      title: 'MMF Table Example',
      route: '/mmftableexample',
      icon: 'grid_on',
    }, 
    {
      title: 'MMF Graph Example',
      route: '/mmfgraphexample',
      icon: 'insert_chart', 
    },
    {
      title: 'Validation Results',
      route: '/valresults',
      icon: 'check_circle',
    },{
      title: 'Model Champion',
      route: '/modelchampion',
      icon: 'flag',
    },{
      title: 'Model Behaviour',
      route: '/modelbehaviour',
      icon: 'trending_flat',
    },{
      title: 'Model Alerts & Policies',
      route: '/alertspolicies',
      icon: 'warning',
    }, {
      title: 'Report Generation',
      route: '/reports',
      icon: 'insert_chart',
    }
  ];

  constructor(private _router: Router) {}

  logout(): void {
    this._router.navigate(['/login']);
  }
}
