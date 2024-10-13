import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslationExampleComponent } from "./components/translation-example/translation-example.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, TranslationExampleComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "frontend";
}
