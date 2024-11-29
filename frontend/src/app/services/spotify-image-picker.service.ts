import { Injectable } from "@angular/core";
import { GetSpotifySearch200ArtistsItemsItemImagesItem } from "../../apiCodegen/backend";

export type SpotifyImage = GetSpotifySearch200ArtistsItemsItemImagesItem;

@Injectable({
    providedIn: "root",
})
export class SpotifyImagePickerService {
    /**
     * @example
     * getImage(images, 960 * 600);
     */
    public getImageUrl(images: SpotifyImage[], targetResolution: number) {
        if (images.length === 0) {
            return this.getDefaultImage();
        }

        const closest = {
            image: images[0],
            difference: Math.abs(
                this.getImageUnidimensionalSize(images[0]) - targetResolution
            ),
        };

        for (const image of images) {
            const difference = Math.abs(
                this.getImageUnidimensionalSize(image) - targetResolution
            );

            if (difference < closest.difference) {
                closest.image = image;
                closest.difference = difference;
            }
        }

        return closest.image.url;
    }

    getImageUnidimensionalSize(size: {
        width: number | null;
        height: number | null;
    }) {
        return (size.width ?? 1) * (size.height ?? 1);
    }

    public getDefaultImage() {
        const defaultImageAmount = 3;
        const imageIndex =  Math.floor(Math.random() * defaultImageAmount) + 1;
        return `/placeholders/placeholder-600x600-${imageIndex}.png`;
    }
}
