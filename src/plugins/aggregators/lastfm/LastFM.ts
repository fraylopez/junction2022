import { Plugin, Privacy, SyncResponse } from "../../../core/Plugin";
import { PartialNested } from "../../../utils/PartialNested";
import { request } from "../../../utils/HTTPRequester";
import { LastFMLRegistrationData } from "./LastFMLRegistrationData";
import { LastFMTrackHistoryResponse } from "./LastFMTrackHistoryResponse";

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
  async sync(): Promise<SyncResponse<LastFMTrackHistoryResponse>> {
    const data = await this.getTrackHistory();
    return { data };
  }

  private async getTrackHistory(): Promise<PartialNested<LastFMTrackHistoryResponse>> {
    const { username, apiKey } = this.data;
    const method = "user.getrecenttracks";
    const rawData = await request<LastFMTrackHistoryResponse>(LastFM.URL, { method: "get", params: { method, username, api_key: apiKey } });
    return this.filter(rawData);
  }

  private filter(rawData: LastFMTrackHistoryResponse): PartialNested<LastFMTrackHistoryResponse> {
    // TODO: do filtering here according to privacy
    return rawData;
  }

}


