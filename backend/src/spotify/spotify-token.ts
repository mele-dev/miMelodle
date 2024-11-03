import axios, { AxiosRequestConfig } from "axios";

type Developer = "cr" | "juan" | "ines";

type SpotifyData = {
    clientId: string;
    clientSecret: string;
};

type TokenResponse = {
    access_token: string;
    token_type: "Bearer";
    expires_in: number;
};

// WARN: Storing tokens like this is unsafe. We don't care for now tho.
const tokenData: Record<Developer, SpotifyData[]> = {
    cr: [
        {
            clientId: "1cbcb63c89134289aac6425996162c4a",
            clientSecret: "f2903f0fa6da4e17b8bb324b86b12940",
        },
    ],
    juan: [
        {
            clientId: "d7e875daefc6477093ca003c463986d4",
            clientSecret: "02d67674f7794d0fb8113a593f8ac773",
        },
    ],
    ines: [],
};

const allData = Object.values(tokenData).flat();

/** Map from client id to token info. */
const tokens: Partial<
    Record<string, { response: TokenResponse; fetchedAt: Date }>
> = {};

let i = 0;

export async function getNextToken() {
    const data = allData[i];

    await reloadTokenIfNecessary(data.clientId);

    i = (i + 1) % allData.length;

    return tokens[data.clientId]!.response.access_token;
}

async function reloadTokenIfNecessary(clientId: string) {
    let dataFromObject = tokens[clientId];

    // If we have a token and it was generated less than 59 minutes ago,
    // we can use it - the limit is 1hr.
    if (dataFromObject !== undefined) {
        const timeDifferenceInSeconds =
            Math.abs(
                new Date().getTime() - dataFromObject.fetchedAt.getTime()
            ) / 1000;

        if (timeDifferenceInSeconds < dataFromObject.response.expires_in - 60) {
            return;
        }
    }

    // At this point we need to generate a new token.
    const dataFromArray = allData.find((d) => d.clientId === clientId);

    if (dataFromArray === undefined) {
        throw Error(
            "Failed to find the information required to create a new backend spotify token."
        );
    }

    const token = await axios.post<TokenResponse>(
        "https://accounts.spotify.com/api/token",
        {
            grant_type: "client_credentials",
            client_id: dataFromArray.clientId,
            client_secret: dataFromArray.clientSecret,
        },
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    tokens[clientId] = {
        response: token.data,
        fetchedAt: new Date(),
    };
}
