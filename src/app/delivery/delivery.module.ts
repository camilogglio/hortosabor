import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { HttpClient } from "@angular/common/http";
import { DeliveryPageRoutingModule } from './delivery-routing.module';
import { createTranslateLoader } from "../../app/app.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { DeliveryPage } from './delivery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [DeliveryPage]
})
export class DeliveryPageModule {}
