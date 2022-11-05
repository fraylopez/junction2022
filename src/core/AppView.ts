import { Plugin } from "./Plugin";
import prompt from "prompt";
import { App } from "./App";

export class AppView {
  private plugins: Plugin[];
  constructor() {
    this.plugins = [];
  }

  init(app: App) {
    app.on("start", () => {
      this.renderLaunch();
      this.renderSelection();
    });
  }
  setPlugins(plugins: Plugin[]) {
    this.plugins = plugins;
  }

  renderLaunch() {
    console.log("Select a plugin to sync");
    this.plugins.forEach((plugin, i) => {
      console.log(`${i + 1}. ${plugin.name}`);
    });
  }

  renderSelection() {
    //capture user input
    prompt.start();
    prompt.get(["plugin"], async (err, result) => {
      const plugin = this.plugins[parseInt(result.plugin.toString()) - 1];
      await this.renderSync(plugin);
    });
  }

  private async renderSync(plugin: Plugin) {
    // render sync
    console.log(`Syncing ${plugin.name}`);
    const response = await plugin.sync();
    // render response
    console.log(response);
    this.renderSelection();
  }
}
