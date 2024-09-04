import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
 
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements OnInit, OnDestroy {

  @Input() data: string | null = null;
  @Output() dataChange = new EventEmitter<string>();

  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }, 
  };

 

  constructor(private util: UtilService) {
  }
 
  ngOnInit(): void {
    
  }
 
  ngOnDestroy() {
    this.data = null;
  }

  onFormEnter() {
    return false;
  }

  onCodeChanged(value) {
    this.dataChange.emit(value);
  }

  loaded(){
    console.log('loaddd')
  }
}
