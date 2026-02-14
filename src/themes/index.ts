import type { ThemeEntry } from "../theme";
import catppuccin from "./catppuccin.json";
import elementsDefault from "./elements-default.json";
import flexoki from "./flexoki.json";
import github from "./github.json";
import smooth from "./smooth.json";
import xcode from "./xcode.json";

export type { ThemeEntry };

export const bundledThemes: ThemeEntry[] = [
  { id: "bandley", name: "Bandley", file: xcode as ThemeEntry["file"] },
  { id: "catppuccin", name: "Catppuccin", file: catppuccin as ThemeEntry["file"] },
  { id: "flexoki", name: "Flexoki", file: flexoki as ThemeEntry["file"] },
  { id: "github", name: "GitHub", file: github as ThemeEntry["file"] },
  { id: "one", name: "One L/D", file: elementsDefault as ThemeEntry["file"] },
  { id: "smooth", name: "Smooth", file: smooth as ThemeEntry["file"] },
];
