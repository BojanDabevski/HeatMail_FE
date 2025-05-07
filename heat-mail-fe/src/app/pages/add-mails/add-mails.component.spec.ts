import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMailsComponent } from './add-mails.component';

describe('AddMailsComponent', () => {
  let component: AddMailsComponent;
  let fixture: ComponentFixture<AddMailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
