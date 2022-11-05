import { Plugin, Privacy, SyncResponse } from "./Plugin";
import prompt from "prompt";
import { DataFetcher } from "./DataFetcher";

export class AppView {
  private plugins: Plugin[];
  private app!: DataFetcher;
  constructor() {
    this.plugins = [];
  }

  init(app: DataFetcher) {
    this.app = app;
    this.app.on("start", () => {
      this.renderLaunch();
      this.renderSelection();
    });
  }
  setPlugins(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  private renderLaunch() {
    console.log("Select a plugin to sync");
    this.plugins.forEach((plugin, i) => {
      console.log(`${i + 1}. ${plugin.name}`);
    });
  }

  private renderSelection() {
    //capture user input
    prompt.start();
    prompt.get(["plugin"], async (err, result) => {
      const plugin = this.plugins[parseInt(result.plugin.toString()) - 1];
      await this.renderSync(plugin);
    });
  }

  private async renderSync(plugin: Plugin) {
    console.log(`Syncing ${plugin.name}`);
    //register for sync events
    const unsubscribe = this.app.subscribe(plugin.name).on("sync", (syncData: SyncResponse<unknown>) => {
      console.log(JSON.stringify(syncData.data, null, 2));
    });
    await this.app.sync(plugin);
    this.app.setupSync(plugin.name, 2);

  }
}

