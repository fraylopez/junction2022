export interface LastFMTrackHistory {
  recenttracks: {
    track: Array<{
      artist: {
        "#text": string;
      };
      image: {
        "#text": string;
        size: string;
      }[];
      name: string;
      date: {
        uts: string;
      };
    }>;
    "@attr": {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
  };
}
