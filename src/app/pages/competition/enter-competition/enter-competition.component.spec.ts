import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterCompetitionComponent } from './enter-competition.component';

describe('EnterCompetitionComponent', () => {
  let component: EnterCompetitionComponent;
  let fixture: ComponentFixture<EnterCompetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterCompetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
