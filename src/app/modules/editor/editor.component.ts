import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class EditorComponent {
  @Input() code!: string;
  @Input() editorOptions: any;
  @Output() codeChanged = new EventEmitter<string>();
  // editorOptions = {theme: 'vs-dark', language: 'javascript'};
  // code: string= 'function x() {\nconsole.log("Hello world!");\n}';

  onCodeChanged(value: any) {
    // console.log('CODE', value);
  }

  onValueChange(value: string){
    this.code = value; // Update the local variable if needed
    this.codeChanged.emit(this.code);
  }
}
