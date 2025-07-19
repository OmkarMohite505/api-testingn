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
import { QueryParamsComponent } from '../query-params/query-params.component';
import { AuthorizationComponent } from '../authorization/authorization.component';
import { HeadersComponent } from "../headers/headers.component";

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
    DialogModule,
    QueryParamsComponent,
    AuthorizationComponent,
    HeadersComponent
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
  activeCollectionFolder: string = '';
  activeCollectionFile: string = '';
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
      id: new Date().getMilliseconds().toString(),
      name: 'New Request',
      closable: true,
      request : {url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states', reqType: this.requestTypeList[0]},
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
                command: (event) => this.onCollectionFolderClick(event),
                items: [
                    {
                        id: new Date().getMilliseconds().toString(),
                        label: 'New Request',
                        command: (event) => this.onCollectionFileClick(event),
                        requestTab: this.activeTab
                    }
                ]
            }
        ]
  }

  ngOnInit(): void {
    let ob = localStorage.getItem('collections');
    if(ob){
      this.collectionItems = JSON.parse(ob);
      this.collectionItems.forEach(folder => {
        folder.command = (event) => this.onCollectionFolderClick(event);
        folder.items?.forEach(file => {
          file.command = (event) => this.onCollectionFileClick(event);
        })
      })
    }
      
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

  onCollectionFileClick(event: any){
    console.log(event);
    this.activeCollectionFile = event?.item.id;
    this.activeTab = this.collectionItems.filter(ele => ele.id === this.activeCollectionFolder)
                      [0].items?.filter(ele => ele.id === this.activeCollectionFile)[0]?.['requestTab'] as Tab;
    this.requestTabs.push(this.activeTab);
    this.activeTabIndex = this.requestTabs.length - 1;
  }

  onCollectionFolderClick(event: any){
    console.log(event);
    this.activeCollectionFolder = event?.item.id;
  }

  createNewEmptyReqTab(){
    this.requestTabs.push(
       {
      id: new Date().getMilliseconds().toString(),
      name: 'New Request',
      closable: true,
      request : {url: '', reqType: this.requestTypeList[0]},
      response: {body: ''}
    }
    );

    this.activeTabIndex = this.requestTabs.length - 1;
  }

  onSubTabClose(event: any) {
    console.log(event);
  }

  createNewTab(){
    let ob: Tab = {
      id: new Date().getMilliseconds().toString(),
      name: 'New Request',
      closable: true,
      request : {url: '', reqType: this.requestTypeList[0]},
      response: {body: ''}
    }
    this.requestTabs.push(ob);
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
    var reqTab = this.requestTabs[this.activeTabIndex];
    this.activeTab = reqTab;
    switch(reqTab.request?.reqType)
    {
      case 'GET': 
        this.apiService.get(reqTab.request?.url as string).subscribe({
          next: (res) => {
            if(this.activeTab.response)
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
        ele.items?.forEach(file => {
          if(file.id === this.activeTab.id){
            this.activeTab.name = this.newReqTabName;
            file['requestTab'] = this.activeTab;
            file.label = this.newReqTabName;
          }
        });
        
        }
      });
      let ob = JSON.stringify(this.collectionItems);
      this.collectionItems = JSON.parse(ob);
      localStorage.setItem('collections', ob);
      return;
    }
    this.collectionsList = this.collectionItems.map(ele => ({ code: ele.id, name: ele.label }));
    this.showSaveReqTabDialog = true;
  }

  onParamsChange(params: any[]) {
    console.log('Updated Params:', params);
    // Use the emitted query parameters as needed
  }

  onAuthChanged(authData: any) {
    console.log('Authorization Info:', authData);
    // Example: { type: 'Bearer Token', token: 'abc123' }
  }

  onHeadersChange(event: any){
    console.log(event);
  }


}
