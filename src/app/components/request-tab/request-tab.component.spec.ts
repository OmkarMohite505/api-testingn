import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTabComponent } from './request-tab.component';

describe('RequestTabComponent', () => {
  let component: RequestTabComponent;
  let fixture: ComponentFixture<RequestTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
