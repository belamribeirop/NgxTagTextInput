import { TestBed } from '@angular/core/testing';

import { NgxTagTextInputService } from './ngx-tag-text-input.service';

describe('NgxTagTextInputService', () => {
  let service: NgxTagTextInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTagTextInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
