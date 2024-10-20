import axios, { AxiosResponse } from "axios";

const apiKey = "";
const url = "https://api.musixmatch.com/ws/1.1";

interface MusixmatchResponse<T> {
    message: {
        body: T;
    };
}

class MusixmatchAPI {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = url;
    }

    private async request<T>(
        endpoint: string,
        /* uso record para asegurar que el tipado de k/v siempre sea string string */
        params: Record<string, string>
    ): Promise<T> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response: AxiosResponse<MusixmatchResponse<T>> =
                await axios.get(url, {
                    params: {
                        /* le paso la apiKey como primer parametro, desp los que
                         * estan definidios en el objeto params */
                        apikey: this.apiKey,
                        ...params,
                    },
                });
            return response.data.message.body;
        } catch (error) {
            console.error("Error fetching data from Musixmatch API:", error);
            throw error;
        }
    }

    /* este metodo nos sirve para traernos la letra por un track id */
    public async getLyricsByTrackId(trackId: string): Promise<any> {
        return this.request("/track.lyrics.get", { track_id: trackId });
    }

    /* traer una cancion por el nombre de la cancion y artista */
    public async searchTrack(track: string, artist: string): Promise<any> {
        return this.request("/track.search", {
            q_track: track,
            q_artist: artist,
            page_size: "1",
            s_track_rating: "desc",
        });
    }

    /* traerte la info de una cancion por su id (INFO, no la letra...) */
    public async getTrackById(trackId: string): Promise<any> {
        return this.request("/track.get", { track_id: trackId });
    }

    /* info de un album por su id */
    public async getAlbumById(albumId: string): Promise<any> {
        return this.request("/album.get", { album_id: albumId });
    }

    /* tracklist de un album */
    public async getTracksByAlbumId(albumId: string): Promise<any> {
        return this.request("/album.tracks.get", { album_id: albumId });
    }

    /* top tracks de un artista */
    public async getArtistTopTracks(artistId: string): Promise<any> {
        return this.request("/artist.top.get", {
            artist_id: artistId,
            page_size: "5",
        });
    }

    /* buscar artista por su nombre */
    public async searchArtist(artist: string): Promise<any> {
        return this.request("/artist.search", {
            q_artist: artist,
            page_size: "1",
            s_artist_rating: "desc",
        });
    }
}

export default MusixmatchAPI;
