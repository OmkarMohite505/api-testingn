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
import { HeadersComponent } from '../headers/headers.component';
import { HttpHeaders } from '@angular/common/http';

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
    HeadersComponent,
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
  requestTypeList: any[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
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
      id: this.generateUniqueId(),
      label: 'New Request',
      closable: true,
      request: {
        url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states',
        reqType: this.requestTypeList[0],
      },
      response: { body: '' },
      isSaved: false
    },
  ];
  activeTab: Tab = this.requestTabs[0];

  constructor(private readonly apiService: ApiService) {
    this.items = [
      {
        label: 'Send and Download',
        command: () => {
          this.sendHttpRequestAndDownload();
        },
      },
    ];
    this.collectionItems = [
      {
        id: this.generateUniqueId(),
        label: 'Default',
        command: (event) => this.onCollectionFolderClick(event),
        items: [],
      },
    ];
  }

  ngOnInit(): void {
    let ob = localStorage.getItem('collections');
    if (ob) {
      this.collectionItems = JSON.parse(ob);
      this.populateCallbackFunction();
    }
  }

  onSubTabChange(event: any) {
    console.log(event);
    switch (event.index) {
      case 0:
        this.activeSubTab = 'Params';
        break;
      case 1:
        this.activeSubTab = 'Authorization';
        break;
      case 2:
        this.activeSubTab = 'Headers';
        break;
      case 3:
        this.activeSubTab = 'Body';
        break;
    }
  }

  onCollectionFileClick(event: any) {
    console.log(event);
    this.activeCollectionFile = event?.item.id;
    this.activeTab = this.collectionItems
      .filter((ele) => ele.id === event?.item['parentId'])?.[0]
      .items?.filter((ele) => ele.id === this.activeCollectionFile)?.[0] as Tab;
    let isReqTabExists = this.requestTabs.filter(
      (ele) => ele.id === event?.item?.id
    );
    if (!isReqTabExists.length) {
      this.requestTabs.push(this.activeTab);
    }
  }

  onCollectionFolderClick(event: any) {
    console.log(event);
    this.activeCollectionFolder = event?.item.id;
  }

  createNewEmptyReqTab() {
    let ob: Tab = {
      id: this.generateUniqueId(),
      label: 'New Request',
      closable: true,
      request: { url: '', reqType: this.requestTypeList[0] },
      response: { body: '' },
      isSaved: true
    };
    this.requestTabs.push(ob);

    this.activeTabIndex = this.requestTabs.length - 1;
  }

  onSubTabClose(event: any) {
    console.log(event);
  }

  onTabChange(event: any) {
    console.log(event);
    this.activeTab = this.requestTabs[event?.index];
  }

  onTabClose(event: any) {
    console.log(event);
    if (this.requestTabs.length === 1) {
      return;
    }
  }
  sendHttpRequest(str: any) {
    var reqTab = this.requestTabs[this.activeTabIndex];
    this.activeTab = reqTab;
    switch (reqTab.request?.reqType) {
      case 'GET':
        this.apiService
          .get(
            reqTab.request?.url as string,
            reqTab.request.params,
            reqTab.request.headers
          )
          .subscribe({
            next: (res) => {
              if (this.activeTab.response)
                this.activeTab.response.body = JSON.stringify(res.body);
            },
            error: (err) => {
              if (this.activeTab && this.activeTab.response)
                this.activeTab.response.body = JSON.stringify(err);
            },
          });
        break;

      case 'POST':
        this.apiService
          .post(
            this.activeTab.request?.url as string,
            this.activeTab.request?.body
          )
          .subscribe({
            next: (res) => {
              if (this.activeTab.response && this.activeTab.response.body)
                this.activeTab.response.body = JSON.stringify(res.body);
            },
            error: (err) => {
              if (this.activeTab && this.activeTab.response) {
                this.activeTab.response.body = JSON.stringify(err);
              }
            },
          });
    }
    console.log(this.activeTabIndex);
  }

  sendHttpRequestAndDownload() {}

  onBodyChange(event: any) {
    this.activeTab.request!.body = event;
  }
  createCollection(event?: any) {
    if (event?.length) {
      if (this.newCollectionName.trim().length) {
        this.collectionItems.push({
          id: this.generateUniqueId(),
          label: this.newCollectionName,
          items: [],
        });
        this.collectionItems = JSON.parse(JSON.stringify(this.collectionItems));
        this.newCollectionName = '';
      }
      return;
    }
    this.showCreateCollecDialog = true;
  }

  saveReqTabInCollection(event?: any) {
    if (event?.length) {
      for (const ele of this.collectionItems) {
        if (ele.id === this.selectedCollectionId) {
          this.activeTab.label = this.newReqTabName;
          const ob: Tab = {
            id: this.generateUniqueId(),
            parentId: this.selectedCollectionId,
            label: this.newReqTabName,
            request: this.activeTab.request,
            isSaved: true,
            response: {body: ''}
          };

          let isAlreadySavedTab = false;

          if (ele.items) {
            for (const file of ele.items) {
              if (file.id === this.activeTab.id) {
                this.activeTab.label = this.activeTab.label;
                file['request'] = this.activeTab.request;
                file.label = this.newReqTabName;
                isAlreadySavedTab = true;
                break; // ✅ exit inner loop once match is found
              }
            }
            if(!isAlreadySavedTab)
              ele.items.push(ob)
          }

          break; // ✅ exit outer loop too if you don't need to process more collections
        }
      }
      let ob = JSON.stringify(this.collectionItems);
      this.collectionItems = JSON.parse(ob);
      localStorage.setItem('collections', ob);
      this.populateCallbackFunction();
      return;
    }
    this.collectionsList = this.collectionItems.map((ele) => ({
      code: ele.id,
      name: ele.label,
    }));
    this.showSaveReqTabDialog = true;
    this.newReqTabName = this.activeTab.isSaved ? this.activeTab.label as string : '';
    this.selectedCollectionId = this.activeTab.isSaved ? this.activeTab.parentId as string : '';
  }

  onParamsChange(params: any[]) {
    console.log('Updated Params:', params);
    let queryString = '';
    params.forEach((ele, index) => {
      if (index === 0) {
        queryString = '?' + ele.key + '=' + ele.value;
      } else {
        if (ele.key?.length || ele.value?.length)
          queryString += '&' + ele.key + '=' + ele.value;
      }
    });
    let url = this.activeTab.request.url.split('?')[0];
    this.activeTab.request.url = url + queryString;
  }

  onAuthChanged(authData: any) {
    console.log('Authorization Info:', authData);
    if (this.activeTab.request.headers) {
      this.activeTab.request.headers.set('Authorization', authData?.token);
    } else {
      let headers = new HttpHeaders();
      headers.set('Authorization', authData?.token);
      this.activeTab.request.headers = headers;
    }
  }

  onHeadersChange(event: any[]) {
    console.log(event);
    this.activeTab.request.headers = this.buildHttpHeaders(event);
  }

  buildHttpHeaders(headerArray: { key: string; value: string }[]): HttpHeaders {
    let headers = new HttpHeaders();
    for (const item of headerArray) {
      if (item.key && item.value) {
        headers = headers.set(item.key, item.value);
      }
    }
    return headers;
  }

  generateUniqueId() {
    return crypto.randomUUID();
  }

  populateCallbackFunction(){
    this.collectionItems.forEach((folder) => {
        folder.command = (event) => this.onCollectionFolderClick(event);
        folder.items?.forEach((file) => {
          file.command = (event) => this.onCollectionFileClick(event);
        });
    });
  }
}
