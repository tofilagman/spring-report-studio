import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'menu-crumb',
  templateUrl: './menu-crumb.component.html',
  styleUrls: ['./menu-crumb.component.scss']
})
export class MenuCrumbComponent implements OnInit {

  @Input()
  public crumbs: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
