import { Component, OnInit } from '@angular/core';
import { deleteDataInfo, loadDataList } from '../stores/dataset/dataset.action';
import { GridButtonComponent } from '../controls/grid/grid-button/grid-button.component';
import { selectActionCounter, selectDataList } from '../stores/dataset/dataset.select';
import { DataList } from '../stores/dataset/dataset.state';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../services/util.service';
import { Store } from '@ngrx/store';
import { ColDef, GridApi } from 'ag-grid-community';
import { GridDataList, ListPageEventArgs } from '../stores/dataset/dataset.model';
import { DocumentTypes, OrientationTypes, SetupComponent } from '../designer/setup/setup.component';
import { CopyComponent } from '../designer/copy/copy.component';

@Component({
  selector: 'app-my-templates',
  templateUrl: './my-templates.component.html',
  styleUrls: ['./my-templates.component.scss']
})
export class MyTemplatesComponent implements OnInit {
  public columnDefinitions: Array<ColDef> = [];
  public columnFilter: Array<any> = [];
  public crumbs: Array<string> = ['Templates']

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
              icon: 'fa-pencil-ruler',
              title: 'Design',
              clicked: (field: number) => {
                this.design(field);
              },
            },
            {
              icon: 'fa-copy',
              title: 'Copy',
              clicked: (field: number) => {
                this.copy(field);
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
        headerName: 'Orientation',
        field: 'orientation',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          const sd = OrientationTypes.find(x => x.id == fx.value);
          return sd ? sd.name : '';
        }
      },
      {
        headerName: 'Document Type',
        field: 'documentType',
        valueFormatter: (fx) => {
          if (fx.value === null)
            return '';
          const sd = DocumentTypes.find(x => x.id == fx.value);
          return sd ? sd.name : '';
        }
      },
    ]
  }

  public loadList() {
    this.store.dispatch(loadDataList({
      dataSource: "template/loadlist",
      skip: this.pageArgs.skip,
      take: this.pageArgs.take,
      filter: {}
    }));
  }

  async openInfo(id: number | null) {

    if (id === undefined || id === null) {
      const res: any = await this.util.showModal(SetupComponent, { id: 0 });
      if (res === false)
        return;
      await this.design(res.id);
    } else {
      const res = await this.util.showModal(SetupComponent, { id: id });
      if (res != null)
        this.loadList();
    }
  }

  async design(id: number | null) {
    const ntp = this.util.compressUri({ id: id });
    await this.router.navigate(["designer", ntp], { relativeTo: this.activatedRoute });
  }

  async deleteInfo(id: number, name: string) {
    if (await this.util.confirmModal(`Continue to delete ${name}?`, 'Template delete')) {
      this.store.dispatch(deleteDataInfo({
        dataSource: 'template',
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

  async copy(id: number | null) {
    const res: any = await this.util.showModal(CopyComponent, { id: id });
    if (res)
      await this.design(res);
  }

}
