import type { Plugin, PluginModule } from "@opencode-ai/plugin";
declare const ServerPlugin: Plugin;
declare const module: PluginModule & {
    id: string;
};
export default module;
export { ServerPlugin };
