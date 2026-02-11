import { TestBed } from '@angular/core/testing';

import { EventsAdminService } from './events-admin-service';

describe('EventsAdminService', () => {
  let service: EventsAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
