import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi } from 'ag-grid-community';
import { GridDataList, ListPageEventArgs } from '../stores/dataset/dataset.model';
import { Store } from '@ngrx/store';
import { UtilService } from '../services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataList } from '../stores/dataset/dataset.state';
import { selectActionCounter, selectDataList } from '../stores/dataset/dataset.select';
import { GridButtonComponent } from '../controls/grid/grid-button/grid-button.component';
import { deleteDataInfo, loadDataList } from '../stores/dataset/dataset.action';
import { RequestLogsInfoComponent } from './request-logs-info/request-logs-info.component';
import { RequestLogsErrorInfoComponent } from './request-logs-error-info/request-logs-error-info.component';

@Component({
  selector: 'app-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: ['./request-logs.component.scss']
})
export class RequestLogsComponent implements OnInit {
  public columnDefinitions: Array<ColDef> = [];
  public columnFilter: Array<any> = [];
  public crumbs: Array<string> = ['Endpoints']

  public rows: GridDataList = {
    Data: [],
    Count: 0
  }

  private pageArgs: ListPageEventArgs = {
    skip: 0, take: 30
  }
  private gridApi!: GridApi;

  constructor(private store: Store, private util: UtilService, private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.select(selectDataList).subscribe((dataList: DataList) => {
      this.rows.Data = [...dataList.data];
      this.rows.Count = dataList.count
    });

    this.store.select(selectActionCounter).subscribe(() => {
      this.loadList();
    });

    this.defineGrid();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        headerName: '',
        field: 'id',
        cellRenderer: GridButtonComponent,
        cellRendererParams: {
          buttons: [
            {
              icon: 'fa-eye',
              title: 'View',
              clicked: (field: number, data: any) => {
                this.openInfo(field, data);
              },
            }
          ]
        },
        minWidth: 80,
        maxWidth: 80,
      },
      {
        headerName: 'Endpoint',
        field: 'endpoint',
        sortable: true
      },
      {
        headerName: 'Status',
        field: 'status',
        cellRenderer: (fx) => {
          if (fx.value === null)
            return '';
          if (fx.value === 1)
            return `<span class="badge text-bg-warning">Pending</span>`;
          else if (fx.value === 2)
            return `<span class="badge text-bg-success">Success</span>`;
          else if (fx.value === 3)
            return `<span class="badge text-bg-danger">Failed</span>`;
          return '';
        }
      },
      {
        headerName: 'Date Requested',
        field: 'dateRequested',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          return this.util.formatDate(fx.value, 'MM/DD/YYYY HH:mm:ss')
        }
      },
      {
        headerName: 'Date Responded',
        field: 'dateResponded',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          return this.util.formatDate(fx.value, 'MM/DD/YYYY HH:mm:ss')
        }
      }
    ]
  }

  public loadList() {
    this.store.dispatch(loadDataList({
      dataSource: "request-log/loadlist",
      skip: this.pageArgs.skip,
      take: this.pageArgs.take,
      filter: {}
    }));
  }

  async openInfo(id: number | null, row: any) {
    if (id === undefined || id === null) {
      id = 0;
    }
    if (row.status === 2)
      await this.util.showModal(RequestLogsInfoComponent, { id: id }, 'xl');
    else if (row.status === 3)
      await this.util.showModal(RequestLogsErrorInfoComponent, { id: id }, 'xl');
  }

  public pageChanged(event: ListPageEventArgs) {
    this.pageArgs = event;
    this.loadList();
  }

  ngOnDestroy(): void {

  }
}
