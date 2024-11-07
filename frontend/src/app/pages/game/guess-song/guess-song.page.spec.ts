import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessSongPage } from './guess-song.page';

describe('GuessSongPage', () => {
  let component: GuessSongPage;
  let fixture: ComponentFixture<GuessSongPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessSongPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessSongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
