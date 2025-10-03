import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDpartmentComponent } from './add-dpartment.component';

describe('AddDpartmentComponent', () => {
  let component: AddDpartmentComponent;
  let fixture: ComponentFixture<AddDpartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDpartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDpartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
