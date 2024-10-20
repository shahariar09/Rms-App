/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OpeningElectricMeterReadingComponent } from './opening-electric-meter-reading.component';

describe('OpeningElectricMeterReadingComponent', () => {
  let component: OpeningElectricMeterReadingComponent;
  let fixture: ComponentFixture<OpeningElectricMeterReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeningElectricMeterReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningElectricMeterReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
