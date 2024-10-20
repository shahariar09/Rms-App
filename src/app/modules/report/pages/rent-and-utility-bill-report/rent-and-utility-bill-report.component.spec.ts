/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RentAndUtilityBillReportComponent } from './rent-and-utility-bill-report.component';

describe('RentAndUtilityBillReportComponent', () => {
  let component: RentAndUtilityBillReportComponent;
  let fixture: ComponentFixture<RentAndUtilityBillReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentAndUtilityBillReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentAndUtilityBillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
