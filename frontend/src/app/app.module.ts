import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StoreModule } from "@ngrx/store";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"; 
import { HttpClientModule } from "@angular/common/http";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastComponent } from './controls/toast/toast.component';

import { environment } from "../environments/environment.prod";
import { AppReducer } from './stores/app.reducer';
import { DataReducer } from './stores/dataset/dataset.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppEffect } from './stores/app.effect';
import { DataEffect } from './stores/dataset/dataset.effect';
import { MyTemplatesComponent } from './my-templates/my-templates.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { ControlsModule } from './controls/controls.module';
import { AgGridModule } from 'ag-grid-angular';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { DesignerComponent } from './designer/designer.component';
import { SetupComponent } from './designer/setup/setup.component';
import { BindingPropertyComponent } from './designer/binding-property/binding-property.component';
import { NgJsonEditorModule } from 'ang-jsoneditor';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { EndpointsInfoComponent } from './endpoints/endpoints-info/endpoints-info.component';
import { CopyEndpointComponent } from './endpoints/copy-endpoint/copy-endpoint.component';
import { LogEndpointComponent } from './endpoints/log-endpoint/log-endpoint.component';  
import { CodeComponent } from './designer/code/code.component';
import { ResourceComponent } from './designer/resource/resource.component'; 
import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { RequestLogsComponent } from './request-logs/request-logs.component';
import { RequestLogsInfoComponent } from './request-logs/request-logs-info/request-logs-info.component';
import { RequestLogsErrorInfoComponent } from './request-logs/request-logs-error-info/request-logs-error-info.component';
import { CopyComponent } from './designer/copy/copy.component';
import { CustomCodeComponent } from './endpoints/custom-code/custom-code.component';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
    MyTemplatesComponent,
    DashboardComponent,
    DesignerComponent,
    SetupComponent,
    BindingPropertyComponent,
    EndpointsComponent,
    EndpointsInfoComponent,
    CopyEndpointComponent,
    LogEndpointComponent,
    CodeComponent,
    ResourceComponent,
    RequestLogsComponent,
    RequestLogsInfoComponent,
    RequestLogsErrorInfoComponent,
    CopyComponent,
    CustomCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgbModule,
    ControlsModule,
    AgGridModule, 
    EditorModule,
    NgJsonEditorModule,
    MonacoEditorModule.forRoot(), 
    ContextMenuModule, 
    StoreModule.forRoot({
      appState: AppReducer,
      dataState: DataReducer
    }),
    EffectsModule.forRoot([AppEffect, DataEffect]),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production })
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
