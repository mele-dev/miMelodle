import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HlmToasterComponent } from "@spartan-ng/ui-sonner-helm";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, HlmToasterComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "frontend";
}
