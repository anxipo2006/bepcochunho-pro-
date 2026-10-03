import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const standaloneRoot = path.join(root, ".next", "standalone");
const standaloneNext = path.join(standaloneRoot, ".next");

await mkdir(standaloneNext, { recursive: true });

const copies = [
  {
    from: path.join(root, "public"),
    to: path.join(standaloneRoot, "public"),
  },
  {
    from: path.join(root, ".next", "static"),
    to: path.join(standaloneNext, "static"),
  },
];

for (const { from, to } of copies) {
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
}

console.log("Standalone package includes public and .next/static assets.");
