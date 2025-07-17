import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  @Input() code!: string;
  @Input() editorOptions: any;
  @Output() codeChanged = new EventEmitter<string>();
  
  private editorInstance!: monaco.editor.IStandaloneCodeEditor;

  onCodeChanged(value: any) {
    this.formatEditor();
  }

  onValueChange(value: string){
    this.code = value; // Update the local variable if needed
    this.codeChanged.emit(this.code);
    this.formatEditor();
  }
  onEditorInit(editor: monaco.editor.IStandaloneCodeEditor) {
    this.editorInstance = editor;
  }
  formatEditor() {
    if (this.editorInstance) {
      this.editorInstance.getAction('editor.action.formatDocument')?.run();
    }
  }
}
