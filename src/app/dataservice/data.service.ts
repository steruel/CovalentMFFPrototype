import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from '@angular/http';
import { HttpInterceptorService } from '@covalent/http';

import { SINGLE, MULTI } from './graphdata';
import { TABLE } from './tabledata';

@Injectable()
export class DataService {
    constructor(private _http: HttpInterceptorService) {}
    /*getSingle(): Promise<any>
    {
        return Promise.resolve(SINGLE);
    }
    getMulti(): Promise<any>
    {
        return Promise.resolve(MULTI);
    }
    getTableData(): Promise<any[]>
    {
        return Promise.resolve(TABLE);
    }
    getTableDataSlowly(): Promise<any[]> {
        // tslint:disable-next-line:typedef
        return new Promise((resolve) => {
          // Simulate server latency with 2 second delay
          setTimeout(() => resolve(this.getTableData()), 2000);
        });
      }*/
    getSingle(): any {
        return SINGLE;
    }
    getMulti(): any {
        return MULTI;
    }
    getTableData(): any[] {
        return TABLE;
    }
    // tslint:disable-next-line:typedef
    getTableDataFromSQLite(dbname, tablename, limit): any  {
        // tslint:disable-next-line:typedef
        let url = 'http://localhost:5000/get_data_table/flatdata/?dbname=' + dbname + '&tablename=' + tablename + '&limit=' + limit;

        // tslint:disable-next-line:typedef
        let resultado: any[] = [];
        let count: number = 0;
        return this._http.get(url).map((res: Response) => {
            return res.json();
            });
    }

    // tslint:disable-next-line:typedef
    insert_project(body): any {
        console.log(body);
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let options: RequestOptions = new RequestOptions({ headers: headers });

        // tslint:disable-next-line:typedef
        let url = 'http://localhost:5000/insert_data_table_project/';
        console.log('URL : ' + url);

        return this._http.post(url, body, options).map((res: Response) => {
                  return res.json();
            });
    }
    // tslint:disable-next-line:typedef
    delete_project(body): any {
        console.log(body);
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let options: RequestOptions = new RequestOptions({ headers: headers });

        // tslint:disable-next-line:typedef
        let url = 'http://localhost:5000/delete_data_table_project/';
        console.log('URL : ' + url);

        return this._http.post(url, body, options).map((res: Response) => {
                  return res.json();
            });
    }
     // tslint:disable-next-line:typedef
     insert_model(body): any {
        console.log(body);
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let options: RequestOptions = new RequestOptions({ headers: headers });

        // tslint:disable-next-line:typedef
        let url = 'http://localhost:5000/insert_data_table_model/';
        console.log('URL : ' + url);

        return this._http.post(url, body, options).map((res: Response) => {
                  return res.json();
            });
    }
    // tslint:disable-next-line:typedef
    delete_model(body): any {
        console.log(body);
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let options: RequestOptions = new RequestOptions({ headers: headers });

        // tslint:disable-next-line:typedef
        let url = 'http://localhost:5000/delete_data_table_model/';
        console.log('URL : ' + url);

        return this._http.post(url, body, options).map((res: Response) => {
                  return res.json();
            });
    }
}
