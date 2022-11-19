import path from "path";

export default {
  root: "src",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, "src/index.html"),
      },
    },
  },
};
