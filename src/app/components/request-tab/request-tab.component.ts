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
import { PanelMenuModule } from 'primeng/panelmenu';
import { DialogModule } from 'primeng/dialog';

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
    SplitButtonModule,
    PanelMenuModule,
    DialogModule
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
  collectionItems!: MenuItem[];
  collectionsList: any[] = [];
  showCreateCollecDialog: boolean = false;
  showSaveReqTabDialog: boolean = false;
  newReqTabName: string = '';
  newCollectionName: string = '';
  selectedCollectionId: string = '';


  requestTabs: Tab[] = [
    {
      id: 0,
      name: 'State List',
      closable: true,
      request : {url: '', reqType: this.requestTypeList[0]},
      response: {body: ''}
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
    this.collectionItems = [
            {
                id: new Date().getMilliseconds().toString(),
                label: 'Default',
                icon: 'pi pi-file',
                items: [
                    {
                        id: new Date().getMilliseconds().toString(),
                        label: 'Get Districts',
                        icon: 'pi pi-file',
                    }
                ]
            }
        ]
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
    switch(reqTab.request?.reqType)
    {
      case 'GET': 
        this.apiService.get(reqTab.request?.url as string).subscribe({
          next: (res) => {
            if(this.activeTab.response && this.activeTab.response.body)
              this.activeTab.response.body = JSON.stringify(res.body);
          },
          error: (err) => {
            if(this.activeTab && this.activeTab.response)
              this.activeTab.response.body = JSON.stringify(err);
          }
        });
        break;
      
      case 'POST':
        this.apiService.post(this.activeTab.request?.url as string, this.activeTab.request?.body).subscribe({
          next: (res) => {
            if(this.activeTab.response && this.activeTab.response.body)
              this.activeTab.response.body = JSON.stringify(res.body);
          },
          error: (err) => {
            if(this.activeTab && this.activeTab.response){
              this.activeTab.response.body = JSON.stringify(err);
            }
          }
        })
    }
    console.log(this.activeTabIndex);
  }

  sendHttpRequestAndDownload(){

  }

  onBodyChange(event: any){
    this.activeTab.request!.body = event;
  }
  createCollection(event?: any){
    if(event?.length){
      if(this.newCollectionName.trim().length){
        this.collectionItems.push({id: new Date().getMilliseconds().toString(), label: this.newCollectionName, items: []});
        this.collectionItems = JSON.parse(JSON.stringify(this.collectionItems));
        this.newCollectionName = '';
      }  
      return;
    }
    this.showCreateCollecDialog = true;
  }

  saveReqTabInCollection(event?: any){
    if(event?.length){
      this.collectionItems.forEach(ele => {
        if(ele.id === this.selectedCollectionId){
          let ob = {
          id: new Date().getMilliseconds().toString(),
          label: this.newReqTabName
        };
        ele.items?.push(ob);
        }
      });

      this.collectionItems = JSON.parse(JSON.stringify(this.collectionItems));
      return;
    }
    this.collectionsList = this.collectionItems.map(ele => ({ code: ele.id, name: ele.label }));
    this.showSaveReqTabDialog = true;
  }

}
