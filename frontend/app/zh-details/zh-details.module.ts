import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { GN2CommonModule } from "@geonature_common/GN2Common.module";
import { ZhDetailsComponent } from "./zh-details.component";
import { DescriptionComponent } from "./description/description.component";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { DelimitationComponent } from "./delimitation/delimitation.component";
import { FonctionnementComponent } from "./fonctionnement/fonctionnement.component";

import { FonctionsComponent } from "./fonctions/fonctions.component";
import { RenseignementsComponent } from "./renseignements/renseignements.component";
import { StatutsComponent } from "./statuts/statuts.component";
import { CollapseComponent } from "../commonComponents/collapse/collapse.component";
import { TableComponent } from "../commonComponents/table/table.component";
import { LabelComponent } from "../commonComponents/label/label.component";
import { HeaderComponent } from "./header/header.component";
import { DeleteModalComponent } from "../commonComponents/delete-modal/delete-modal.component";

// my module routing
const routes: Routes = [
  { path: "zhDetails/:id", component: ZhDetailsComponent },
];

@NgModule({
  declarations: [
    ZhDetailsComponent,
    DelimitationComponent,
    DescriptionComponent,
    EvaluationComponent,
    FonctionnementComponent,
    FonctionsComponent,
    RenseignementsComponent,
    StatutsComponent,
    CollapseComponent,
    TableComponent,
    LabelComponent,
    HeaderComponent,
    DeleteModalComponent,
  ],
  entryComponents: [DeleteModalComponent],
  imports: [GN2CommonModule, CommonModule, RouterModule.forChild(routes)],
  exports: [TableComponent],
})
export class ZhDetailsModule {}
