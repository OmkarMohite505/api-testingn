import { Component, EventEmitter, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-query-params',
  standalone: true,
  imports: [TableModule, CheckboxModule, InputTextModule, ButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './query-params.component.html',
  styleUrl: './query-params.component.scss'
})
export class QueryParamsComponent {
  @Output() queryParamsChange = new EventEmitter<any[]>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      params: this.fb.array([])
    });

    // Start with one empty row
    this.addParam();
  }

  get params() {
    return this.form.get('params') as FormArray;
  }

  addParam() {
    const paramGroup = this.fb.group({
      enabled: [true],
      key: [''],
      value: ['']
    });

    paramGroup.valueChanges.pipe(debounceTime(0)).subscribe(() => {
      this.emitChanges();
    });

    this.params.push(paramGroup);
    this.emitChanges();
  }

  removeParam(index: number) {
    this.params.removeAt(index);
    this.emitChanges();
  }

  emitChanges() {
    const filtered = this.params.value.filter((p: any) => p.enabled);
    this.queryParamsChange.emit(filtered);
  }

  asFormGroup(control: AbstractControl): FormGroup {
  return control as FormGroup;
}

}
