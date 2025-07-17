import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { EditorModule } from './modules/editor/editor.module';
import { languages } from 'monaco-editor';
import { RequestTabComponent } from './components/request-tab/request-tab.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MonacoEditorModule, FormsModule, EditorModule, RequestTabComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'api-ui';
  editorOptions = {theme: 'vs-dark', language: 'json'};
  code: string= 'function x() {\nconsole.log("Hello world!");\n}';
}
