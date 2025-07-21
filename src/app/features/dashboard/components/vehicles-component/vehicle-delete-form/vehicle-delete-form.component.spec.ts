import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDeleteFormComponent } from './vehicle-delete-form.component';

describe('VehicleDeleteFormComponent', () => {
  let component: VehicleDeleteFormComponent;
  let fixture: ComponentFixture<VehicleDeleteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDeleteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
