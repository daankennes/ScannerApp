import { Component } from '@angular/core';

import { CamPage } from '../cam/cam';
import { ListPage } from '../list/list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CamPage;
  tab2Root = ListPage;

  constructor() {

  }
}
