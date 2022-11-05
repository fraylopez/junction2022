import { Plugin, Privacy, SyncResponse } from "../../../core/Plugin";
import { PartialNested } from "../../../utils/PartialNested";
import { request } from "../../../utils/HTTPRequester";
import { LastFMLRegistrationData } from "./LastFMLRegistrationData";
import { LastFMTrackHistory } from "./LastFMTrackHistory";

export class LastFM implements Plugin {
  private static URL = "http://ws.audioscrobbler.com/2.0/";
  name = "LastFM";
  private privacy?: Privacy;
  constructor(
    private readonly data: LastFMLRegistrationData,
  ) {
    this.name = "LastFM";
  }

  register(): Promise<void> {
    throw new Error("Method not implemented. Hardcoded");
  }
  setupPrivacy(privacy: Privacy): void {
    this.privacy = privacy;
  }
  authorize(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async sync(): Promise<SyncResponse<LastFMTrackHistory>> {
    const data = await this.getTrackHistory();
    return { data };
  }

  private async getTrackHistory(): Promise<PartialNested<LastFMTrackHistory>> {
    const { username, apiKey } = this.data;
    const method = "user.getrecenttracks";
    const rawData = await request<LastFMTrackHistory>(LastFM.URL, { method: "get", params: { method, username, api_key: apiKey } });
    return this.filter(rawData);
  }

  private filter(rawData: LastFMTrackHistory): PartialNested<LastFMTrackHistory> {
    // TODO: do filtering here according to privacy
    return rawData;
  }

}


