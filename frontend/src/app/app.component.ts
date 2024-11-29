import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { QueryStringHandlerService } from "./services/queryStringHandler/query-string-handler.service";
import { HlmToasterComponent } from "@spartan-ng/ui-sonner-helm";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, HlmToasterComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    title = "frontend";
    queryStringHandler = inject(QueryStringHandlerService);

    async ngOnInit() {
      this.queryStringHandler.listen();
    }
}
