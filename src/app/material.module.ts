import { NgModule } from "@angular/core";
import { MatToolbarModule } from '@angular/material/toolbar'; // Importamos el mat-toolbar que se encuentra en el archivo HTML
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon/';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const myModules: any[] = [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule
];

@NgModule({
    imports: [ [ ...myModules] ],
    exports: [ [ ...myModules] ]
})
export class MaterialModule{

}

