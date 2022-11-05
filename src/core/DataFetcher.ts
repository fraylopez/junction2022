import { LastFM } from "../plugins/aggregators/lastfm/LastFM";
import { Plugin, SyncResponse } from "./Plugin";
import dotenv from "dotenv";
import assert from "assert";
import { AppView } from "./AppView";
import { emit } from "process";

interface PersonalIdentifiableInformation {
  name: string;
  email: string;
  phone: string;
}

type LifecycleEvent = "start";
type SyncEvent = "sync" | "synced" | "syncError";

export class DataFetcher {
  private plugins: Plugin[] = [];
  private view?: AppView;
  private lifeCycleListeners: Map<LifecycleEvent, (data?: unknown) => void>;
  private pluginListeners: Map<string, Map<SyncEvent, (data?: unknown) => void>>;
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

  setupSync(plugin: string, timeStepSeconds: number = 10) {
    const pluginInstance = this.plugins.find(p => p.name === plugin);
    assert(pluginInstance, `Plugin ${plugin} not found`);
    setInterval(() => this.sync(pluginInstance!), timeStepSeconds * 1000);
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
      on: (event: SyncEvent, callback: (data: SyncResponse<unknown>) => void) => {
        const listeners = this.pluginListeners.get(plugin) || new Map();
        listeners.set(event, callback);
        this.pluginListeners.set(plugin, listeners);
        return () => {
          const listeners = this.pluginListeners.get(plugin) || new Map();
          listeners.delete(event);

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

  async sync(plugin: string): Promise<void>;
  async sync(plugin: Plugin): Promise<void>;
  async sync(plugin: Plugin | string): Promise<void> {
    const plgn = typeof plugin === "string" ? this.plugins.find(p => p.name === plugin) : plugin;
    assert(plgn, `Plugin ${plugin} not found`);

    const response = await plgn.sync();
    this.emit(plgn.name, "sync", response);
  }

  private emit(plugin: string, event: SyncEvent, data: SyncResponse<unknown>) {
    const listeners = this.pluginListeners.get(plugin);
    listeners?.get(event)?.(data);
  }

}

