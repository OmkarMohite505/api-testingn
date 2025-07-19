import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [TableModule, CheckboxModule, InputTextModule, ButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './headers.component.html',
  styleUrl: './headers.component.scss'
})
export class HeadersComponent {
  @Output() headersChange = new EventEmitter<any[]>();
  
    form: FormGroup;
  
    constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
        headers: this.fb.array([])
      });
  
      // Start with one empty row
      this.addHeader();
    }
  
    get headers() {
      return this.form.get('headers') as FormArray;
    }
  
    addHeader() {
      const headerGroup = this.fb.group({
        enabled: [true],
        key: [''],
        value: ['']
      });
  
      headerGroup.valueChanges.subscribe(() => {
        this.emitChanges();
      });
  
      this.headers.push(headerGroup);
      this.emitChanges();
    }
  
    removeHeader(index: number) {
      this.headers.removeAt(index);
      this.emitChanges();
    }
  
    emitChanges() {
      const filtered = this.headers.value.filter((p: any) => p.enabled);
      this.headersChange.emit(filtered);
    }
  
    asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
  
}
