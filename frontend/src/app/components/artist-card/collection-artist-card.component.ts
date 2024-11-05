import { Component, inject, OnInit } from "@angular/core";
import { HomeArtistsService } from "../../services/home-artists.service";

@Component({
    selector: "app-collection-artist-card",
    standalone: true,
    imports: [],
    templateUrl: "./collection-artist-card.component.html",
})
export class CollectionArtistCardComponent implements OnInit {
    public homeArtistsService = inject(HomeArtistsService);
    public async ngOnInit() {
        await this.homeArtistsService.loadData();
    }

    onClick(){
      // logica para comenzar el juego (llamar al endpoint ?)
    }
}
