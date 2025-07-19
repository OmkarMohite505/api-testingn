import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-authorization',
  standalone: true,
  imports: [DropdownModule, FormsModule, CommonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {
  @Output() authChange = new EventEmitter<any>();

  authForm: FormGroup;
  authTypes = [
    'Inherit auth from parent',
    'No Auth',
    'Basic Auth',
    'Bearer Token',
    'JWT Bearer',
    'Digest Auth',
    'OAuth 1.0',
    'OAuth 2.0',
    'Hawk Authentication',
    'AWS Signature',
    'NTLM Authentication',
    'API Key',
    'Akamai EdgeGrid',
    'ASAP (Atlassian)'
  ];
    authType: string = this.authTypes[1];
    token: string = '';

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      type: ['Bearer Token'],
      token: [''] // default field for bearer token
    });

    this.authForm.valueChanges.subscribe((val) => {
      this.emitAuthConfig(val);
    });
  }

  emitAuthConfig(value: any) {
    this.authChange.emit(value);
  }

  isBearerTokenSelected(): boolean {
    return this.authForm.get('type')?.value === 'Bearer Token';
  }

  onAuthTypeChange(event: any){
    this.emitAuthConfig({authType: this.authType, token:this.token});
  }

  onTokenChange(event: any){
    this.emitAuthConfig({authType: this.authType, token:this.token});
  }
}
