import { Component } from '@angular/core';
import {DropDownService} from "./core/services/drop-down.service";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

  constructor(private dropDownService:DropDownService){
    this.dropDownService.performTheProcess();

  }
}
