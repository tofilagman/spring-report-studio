import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyTemplatesComponent } from './my-templates/my-templates.component';
import { DesignerComponent } from './designer/designer.component';
import { EndpointsComponent } from './endpoints/endpoints.component';
import { RequestLogsComponent } from './request-logs/request-logs.component';
import { CustomCodeComponent } from './endpoints/custom-code/custom-code.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: "my-templates",
    component: MyTemplatesComponent
  },
  {
    path: "my-templates/designer/:id",
    component: DesignerComponent
  },
  {
    path: "endpoints",
    component: EndpointsComponent
  },
  {
    path: "endpoints/custom-code/:id",
    component: CustomCodeComponent
  },
  {
    path: "request-logs",
    component: RequestLogsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
