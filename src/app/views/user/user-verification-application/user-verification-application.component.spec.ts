import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVerificationApplicationComponent } from './user-verification-application.component';

describe('UserVerificationApplicationComponent', () => {
  let component: UserVerificationApplicationComponent;
  let fixture: ComponentFixture<UserVerificationApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVerificationApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVerificationApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
