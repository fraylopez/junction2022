import { App } from "./core/App";
import { AppView } from "./core/AppView";


const testView = new AppView();
new App()
  .addView(testView)
  .launch();