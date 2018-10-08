import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteParamsComponent } from './route-params.component';

describe('RouteParamsComponent', () => {
  let component: RouteParamsComponent;
  let fixture: ComponentFixture<RouteParamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteParamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
