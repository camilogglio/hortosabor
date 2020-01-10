import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CartlistPage } from './cartlist.page';

describe('CartlistPage', () => {
  let component: CartlistPage;
  let fixture: ComponentFixture<CartlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CartlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
