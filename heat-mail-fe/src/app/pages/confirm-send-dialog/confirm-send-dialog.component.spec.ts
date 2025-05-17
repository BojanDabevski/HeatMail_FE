import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSendDialogComponent } from './confirm-send-dialog.component';

describe('ConfirmSendDialogComponent', () => {
  let component: ConfirmSendDialogComponent;
  let fixture: ComponentFixture<ConfirmSendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmSendDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
