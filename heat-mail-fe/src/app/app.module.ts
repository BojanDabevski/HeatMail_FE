import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations:[
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatButtonModule
    ],
    providers: [],
    bootstrap: []
})

export class SharedModule{}