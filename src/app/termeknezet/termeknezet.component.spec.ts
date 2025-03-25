import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermeknezetComponent } from './termeknezet.component';

describe('TermeknezetComponent', () => {
  let component: TermeknezetComponent;
  let fixture: ComponentFixture<TermeknezetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermeknezetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermeknezetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
