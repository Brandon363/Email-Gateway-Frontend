import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraUserIdComponent } from './camera-user-id.component';

describe('CameraUserIdComponent', () => {
  let component: CameraUserIdComponent;
  let fixture: ComponentFixture<CameraUserIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraUserIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraUserIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
