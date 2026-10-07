import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "esnext",
  outDir: "api", // Changed from 'dist' to 'api'
  clean: true,
  bundle: true,
  splitting: false,
  sourcemap: true,
  external: ['@prisma/client', 'prisma', '@prisma/adapter-pg', '@prisma/orm-postgres'], 
  banner: {
    js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
  },
});
