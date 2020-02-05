import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CartlistPageRoutingModule } from './cartlist-routing.module';
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../../app/app.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { CartlistPage } from './cartlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartlistPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [CartlistPage]
})
export class CartlistPageModule {}
