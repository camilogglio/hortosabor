import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { createTranslateLoader } from "../../app/app.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HttpClient } from "@angular/common/http";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
