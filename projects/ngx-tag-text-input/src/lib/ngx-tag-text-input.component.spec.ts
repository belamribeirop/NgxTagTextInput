import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTagTextInputComponent } from './ngx-tag-text-input.component';

describe('NgxTagTextInputComponent', () => {
  let component: NgxTagTextInputComponent;
  let fixture: ComponentFixture<NgxTagTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxTagTextInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxTagTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
