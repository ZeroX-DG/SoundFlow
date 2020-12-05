export interface ISearchResult {
  [service: string]: ITrackInfo[];
}

export interface ITrackInfo {
  title: string;
  author: string;
  thumbnail_url: string;
  url: string;
}

export class Search {
  public async search_tracks(query: string): Promise<ISearchResult> {
    const url = "/api/tracks/search/" + query;
    return fetch(url).then(res => res.json());
  }
}
