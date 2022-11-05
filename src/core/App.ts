import { LastFM } from "../plugins/aggregators/lastfm/LastFM";
import { Plugin } from "./Plugin";
import dotenv from "dotenv";
import assert from "assert";
import { AppView } from "./AppView";

interface PersonalIdentifiableInformation {
  name: string;
  email: string;
  phone: string;
}

type LifecycleEvent = "start";
type SyncEvent = "start" | "sync" | "synced" | "syncError";

export class App {
  private plugins: Plugin[] = [];
  private view?: AppView;
  private lifeCycleListeners: Map<LifecycleEvent, (data?: unknown) => void> = new Map();
  private pluginListeners: Map<string, ((event: SyncEvent, data: unknown) => void)[]>;
  constructor() {
    dotenv.config();
    this.plugins = [
      new LastFM({ username: process.env.LAST_FM_USERNAME!, apiKey: process.env.LAST_FM_API_KEY! }),
    ];
    this.pluginListeners = new Map();
    this.lifeCycleListeners = new Map();
  }

  addView(view: AppView) {
    this.view = view;
    this.view.init(this);
    this.view.setPlugins(this.plugins);
    return this;
  }

  addPlugin(plugin: Plugin) {
    assert(!this.plugins.find(p => p.name === plugin.name), `Plugin ${plugin.name} already exists`);
    this.plugins.push(plugin);
  }

  on(event: LifecycleEvent, callback: (data?: unknown) => void) {
    this.lifeCycleListeners.set(event, callback);
  }

  subscribe(plugin: string) {
    assert(this.plugins.find(p => p.name === plugin), `Plugin ${plugin} not found`);
    return {
      on: (callback: (event: SyncEvent, data: unknown) => void) => {
        const listeners = this.pluginListeners.get(plugin) || [];
        listeners.push(callback);
        this.pluginListeners.set(plugin, listeners);
        return () => {
          const listeners = this.pluginListeners.get(plugin) || [];
          const index = listeners.indexOf(callback);
          listeners.splice(index, 1);
          this.pluginListeners.set(plugin, listeners);
        };
      }
    };
  }

  createAccount(pii: PersonalIdentifiableInformation) {
    // create account
  }

  launch() {
    this.lifeCycleListeners.get("start")?.();
  }

  private async sync(plugin: Plugin) {
    const response = await plugin.sync();
    this.emit(plugin.name, "sync", response);
  }

  private emit(plugin: string, event: SyncEvent, data: unknown) {
    const listeners = this.pluginListeners.get(plugin) || [];
    listeners.forEach(listener => listener(event, data));
  }

}

