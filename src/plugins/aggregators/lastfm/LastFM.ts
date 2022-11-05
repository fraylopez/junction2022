import { Plugin, Privacy, SyncResponse } from "../../../core/Plugin";
import { request } from "../HTTPRequester";

interface LastFMLRegistrationData {
  username: string;
  apiKey: string;
}

interface LastFMTrackHistory {
  history: LastFMTrack[];
}

interface LastFMTrack {
  artist: string;
  imageURL: string;
  songName: string;
  timestamp: number;
}


export class LastFM implements Plugin {
  private static URL = "http://ws.audioscrobbler.com/2.0/";
  name = "LastFM";

  constructor(
    private readonly data: LastFMLRegistrationData,

  ) {
    this.name = "LastFM";
  }

  register(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  setupPrivacy(privacy: Privacy): Promise<void> {
    throw new Error("Method not implemented.");
  }
  authorize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async sync(): Promise<SyncResponse<LastFMTrackHistory>> {
    const history = await this.getTrackHistory();
    return { data: history };
  }

  private getTrackHistory(): Promise<LastFMTrackHistory> {
    const { username, apiKey } = this.data;
    const method = "user.getrecenttracks";
    return request<LastFMTrackHistory>(LastFM.URL, { method: "get", params: { method, username, api_key: apiKey } });
  }

}


