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
import { EndpointsInfoComponent } from './endpoints-info/endpoints-info.component';
import { CopyEndpointComponent } from './copy-endpoint/copy-endpoint.component';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrls: ['./endpoints.component.scss']
})
export class EndpointsComponent implements OnInit {
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
              icon: 'fa-edit',
              title: 'Edit',
              clicked: (field: number) => {
                this.openInfo(field);
              },
            },
            {
              icon: 'fa-copy',
              title: 'Copy Endpoint',
              clicked: (field: number) => {
                this.copyEndpoint(field);
              },
            },
            {
              icon: 'fa-code',
              title: 'Custom Code',
              clicked: (field: number) => {
                  this.code(field);
              },
            },
            {
              icon: 'fa-trash',
              title: 'Delete',
              cssClass: 'btn-outline-danger',
              clicked: (field: number, data: any) => {
                this.deleteInfo(field, data.name);
              },
            },
          ]
        },
        minWidth: 180,
        maxWidth: 180,
      },
      {
        headerName: 'Name',
        field: 'name',
        sortable: true
      },
      {
        headerName: 'Template',
        field: 'template',
      },
      {
        headerName: 'Endpoint',
        field: 'cuid',
      },
      {
        headerName: 'Expires In',
        field: 'expiresIn',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          return this.util.formatDate(fx.value)
        }
      },
      {
        headerName: 'Owner',
        field: 'owner',
      },
      {
        headerName: 'Active',
        field: 'isActive',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          return fx.value
        }
      },
    ]
  }

  public loadList() {
    this.store.dispatch(loadDataList({
      dataSource: "endpoint/loadlist",
      skip: this.pageArgs.skip,
      take: this.pageArgs.take,
      filter: {}
    }));
  }

  async openInfo(id: number | null) {
    if (id === undefined || id === null) {
      id = 0;
    }
    const res = await this.util.showModal(EndpointsInfoComponent, { id: id });
    if (res != null)
      this.loadList();
  }

  async copyEndpoint(id: number | null) { 
    await this.util.showModal(CopyEndpointComponent, { id: id }, 'lg');
  }

  async deleteInfo(id: number, name: string) {
    if (await this.util.confirmModal(`Continue to delete ${name}?`, 'Position delete')) {
      this.store.dispatch(deleteDataInfo({
        dataSource: 'club_position',
        id: id
      }))
    }
  }

  public pageChanged(event: ListPageEventArgs) {
    this.pageArgs = event;
    this.loadList();
  }

  ngOnDestroy(): void {

  }

  async code(id: number | null) {
    const ntp = this.util.compressUri({ id: id });
    await this.router.navigate(["custom-code", ntp], { relativeTo: this.activatedRoute });
  }

}

