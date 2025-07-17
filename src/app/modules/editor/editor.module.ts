import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { EditorComponent } from './editor.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule.forRoot()
  ],
  exports: [EditorComponent]
})
export class EditorModule { }
