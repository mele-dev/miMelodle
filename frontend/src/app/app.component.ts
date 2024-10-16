import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { RegisterPage } from "./register-page/register.page";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, RegisterPage],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent {
    title = "frontend";
}
