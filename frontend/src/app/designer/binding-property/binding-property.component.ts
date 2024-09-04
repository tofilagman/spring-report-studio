import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-binding-property',
  templateUrl: './binding-property.component.html',
  styleUrls: ['./binding-property.component.scss']
})
export class BindingPropertyComponent implements OnInit, OnDestroy {
 
  @Input() data: string | null = null;
  @Output() dataChange = new EventEmitter<string>();
  
  public editorOptions: JsonEditorOptions; 
  uiData: any | null = null;
  
  
  dataEditorOptions = { language: 'json', automaticLayout: true };
  
  constructor() {
    this.editorOptions = new JsonEditorOptions()
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; 
  }

  ngOnInit(): void { 
     this.uiData = JSON.parse(this.data);
  }
 
  getData(data: any){
    this.data = JSON.stringify(data);
    this.dataChange.emit(this.data); 
  }

  ngOnDestroy() { 
     
  }
 
}
