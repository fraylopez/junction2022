import { DataFetcher } from "./core/DataFetcher";
import { AppView } from "./core/AppView";


const testView = new AppView();
new DataFetcher()
  .addView(testView)
  .launch();