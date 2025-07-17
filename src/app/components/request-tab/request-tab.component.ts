import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../models/tab';
import { RequestType } from '../../models/RequestType';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '../../modules/editor/editor.module';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-request-tab',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    EditorModule,
    DropdownModule
  ],
  templateUrl: './request-tab.component.html',
  styleUrl: './request-tab.component.scss',
})
export class RequestTabComponent implements OnInit {
  editorOptions = { theme: 'vs-dark', language: 'json' };
  tabSections = [
    { label: 'Params' },
    { label: 'Authorization' },
    { label: 'Headers' },
    { label: 'Body' },
  ];
  requestTypeList: any[] = Object.values(RequestType);
  activeSubTab: string = 'Params';

  requestTabs: Tab[] = [
    {
      id: 1,
      name: 'State List',
      reqType: RequestType.GET,
      Url: 'https://',
      body: 'sdjhskdfhsdfjk\n\n',
      headers: '',
      params: [{ key: '', value: '' }],
      closable: true,
    },
  ];

  ngOnInit(): void {
      this.requestTypeList = this.requestTypeList.map(ele => {name: ele; code: ele})
      console.log(this.requestTypeList)
  }

  onSubTabChange(event: any) {
    console.log(event);
    switch(event.index){
      case 0:
        this.activeSubTab = "Params";
        break;
      case 1:
        this.activeSubTab = "Authorization";
        break;
      case 2:
        this.activeSubTab = "Headers";
        break;
      case 3:
        this.activeSubTab = "Body";
        break;
    }
  }

  onSubTabClose(event: any) {
    console.log(event);
  }
}
