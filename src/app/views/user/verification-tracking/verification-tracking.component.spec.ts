import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationTrackingComponent } from './verification-tracking.component';

describe('VerificationTrackingComponent', () => {
  let component: VerificationTrackingComponent;
  let fixture: ComponentFixture<VerificationTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
