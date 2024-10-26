import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { QueryParamsService } from "./services/query-params.service";
import { QueryStringHandlerService } from "./services/queryStringHandler/query-string-handler.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
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
