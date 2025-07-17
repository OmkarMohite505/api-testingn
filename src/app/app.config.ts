import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    BrowserAnimationsModule,
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets/monaco', // make sure monaco editor is available here
        defaultOptions: { scrollBeyondLastLine: false },
        onMonacoLoad: () => {
          console.log('Monaco Editor Loaded');
        }
      }
    },
    provideClientHydration()
  ]
};
