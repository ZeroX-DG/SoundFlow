export interface ISearchResult {
  [service: string]: ITrackInfo[];
}

export interface ITrackInfo {
  title: string;
  author: string;
  thumbnail_url: string;
  url: string;
  provider: string;
}

export interface ITrackUrl {
  url: string;
}

export class Api {
  public async search_tracks(query: string): Promise<ISearchResult> {
    const url = "/api/tracks/search/" + query;
    return fetch(url).then(res => res.json());
  }

  public async get_track_url(
    url: string,
    provider: string = "youtube"
  ): Promise<ITrackUrl> {
    const api_url = `/api/play?url=${url}&provider=${provider}`;
    return fetch(api_url).then(res => res.json());
  }
}
