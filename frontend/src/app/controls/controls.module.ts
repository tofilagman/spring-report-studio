import { NgModule } from "@angular/core";
import { MenuCrumbComponent } from "./menu-crumb/menu-crumb.component";
import { CommonModule } from "@angular/common";
import { DatePickerComponent } from './date-picker/date-picker.component';
import { XCurrencyPipe } from "./pipes/x-currency.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { XDatePipe } from './pipes/x-date.pipe';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import { ListPagingComponent } from "./list-paging/list-paging.component";
import { PDFViewerComponent } from './pdfviewer/pdfviewer.component';
import {AdvanceSearchComponent} from "./advance-search/advance-search.component"; 
import { StepperComponent } from './stepper/stepper.component';
import { CdkStepperModule } from "@angular/cdk/stepper"; 
import { GridButtonComponent } from "./grid/grid-button/grid-button.component";
import { TreeviewModule } from "./ngx-tree-view/treeview.module";
import { TreeviewComponent } from "./ngx-tree-view/components/treeview/treeview.component"; 
import { DropdownTreeviewComponent } from "./ngx-tree-view/components/dropdown-treeview/dropdown-treeview.component";
import { TreeviewPipe } from "./ngx-tree-view/pipes/treeview.pipe";
import { BSwitchComponent } from './bswitch/bswitch.component';
import { ConfirmationModalComponent } from "./modals/confirmation-modal/confirmation-modal.component";
import { FileUploadModalComponent } from "./modals/file-upload-modal/file-upload-modal.component";
 


@NgModule({
  declarations : [
    ConfirmationModalComponent,
    FileUploadModalComponent,
    MenuCrumbComponent,
    XCurrencyPipe,
    DatePickerComponent,
    XDatePipe,
    DateRangePickerComponent,
    ListPagingComponent,
    PDFViewerComponent,
    AdvanceSearchComponent,
    StepperComponent, 
    GridButtonComponent, 
    BSwitchComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule, 
    CdkStepperModule,
    TreeviewModule.forRoot()
  ],
  exports: [
    MenuCrumbComponent,
    XCurrencyPipe,
    DatePickerComponent,
    XDatePipe,
    DateRangePickerComponent,
    ListPagingComponent,
    PDFViewerComponent,
    AdvanceSearchComponent,
    StepperComponent,
    TreeviewComponent, 
    DropdownTreeviewComponent,
    TreeviewPipe,
    BSwitchComponent
  ]
})
export class ControlsModule {}
