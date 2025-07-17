import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from '../../models/tab';
import { RequestType } from '../../models/RequestType';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '../../modules/editor/editor.module';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-request-tab',
  standalone: true,
  imports: [
    TabViewModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    EditorModule,
    DropdownModule,
    SplitButtonModule
  ],
  templateUrl: './request-tab.component.html',
  styleUrl: './request-tab.component.scss',
})
export class RequestTabComponent implements OnInit {
  editorOptions = { theme: 'vs', language: 'json' };
  responseEditorOptions = { theme: 'vs', language: 'json', readOnly: true };
  tabSections = [
    { label: 'Params' },
    { label: 'Authorization' },
    { label: 'Headers' },
    { label: 'Body' },
  ];
  // requestTypeList: any[] = Object.values(RequestType).map(ele => {name: ele; code: ele});
  requestTypeList: any[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  activeSubTab: string = 'Params';
  activeTabIndex: number = 0;
  items: MenuItem[] = [];


  requestTabs: Tab[] = [
    {
      id: 0,
      name: 'State List',
      reqType: 'GET',
      Url: 'https://',
      body: 'sdjhskdfhsdfjk\n\n',
      headers: '',
      params: [{ key: '', value: '' }],
      closable: true,
      response: '{}'
    }
  ];
  activeTab: Tab = this.requestTabs[0];

  constructor(private readonly apiService: ApiService){
    this.items = [
            {
                label: 'Send and Download',
                command: () => {
                    this.sendHttpRequestAndDownload();
                }
            }
        ];
  }

  ngOnInit(): void {
      
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

  onTabChange(event: any){
    console.log(event);
  }

  onTabClose(event: any){
    console.log(event);
    if(this.requestTabs.length === 1){
      return;
    }
  }
  sendHttpRequest(str: any){
    var reqTab = this.requestTabs.filter(ele => ele.id === this.activeTabIndex)[0];
    this.activeTab = reqTab;
    switch(reqTab.reqType)
    {
      case 'GET': 
        this.apiService.get(reqTab.Url).subscribe({
          next: (res) => {
            this.activeTab.response = JSON.stringify(res);
          },
          error: (err) => {
            this.activeTab.errors = err;
          }
        })
    }
    console.log(this.activeTabIndex);
  }

  sendHttpRequestAndDownload(){

  }

}
