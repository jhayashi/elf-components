import { About } from "../../../src/About";
import { AppMenu } from "../../components/AppMenu";

export default function AboutPage() {
  return (
    <About
      iconSrc="/icon-128.png"
      appName="ELF Demo"
      version="v0.2.0"
      description="A demonstration of the shared ELF component library — theming, menu, settings, and page patterns."
      menu={<AppMenu currentPath="/settings/about" />}
    />
  );
}
