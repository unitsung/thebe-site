import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const vitepressBin = fileURLToPath(
  new URL("../node_modules/vitepress/bin/vitepress.js", import.meta.url),
);

for (const locale of ["zh", "en"]) {
  execFileSync(process.execPath, [vitepressBin, "build", "."], {
    cwd: packageRoot,
    env: {
      ...process.env,
      DOCS_LOCALE: locale,
    },
    stdio: "inherit",
  });
}

