import { Component, inject } from "@angular/core";
import { FriendshipsTranslator } from "./friendships.translations";
import { Friend, FriendsService } from "../../services/friends.service";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";

@Component({
    selector: "app-friendships",
    standalone: true,
    imports: [HlmButtonModule],
    templateUrl: "./friendships.component.html",
})
export class FriendshipsComponent {
    dict = inject(FriendshipsTranslator).dict;
    public friendsService = inject(FriendsService);

    async ngOnInit() {
        await this.friendsService.reloadUsers();
    }

    async acceptFriendRequest(friend: Friend) {
        this.friendsService.acceptFriendRequest(friend.id);
    }

    async declineFriendRequest(friend: Friend) {
        this.friendsService.deleteFriend(friend.id);
    }
}
