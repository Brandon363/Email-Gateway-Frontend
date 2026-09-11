import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserByIdComponent } from './view-user-by-id.component';

describe('ViewUserByIdComponent', () => {
  let component: ViewUserByIdComponent;
  let fixture: ComponentFixture<ViewUserByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUserByIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
