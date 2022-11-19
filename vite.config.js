import path from "path";

export default {
  root: "src",
  build: {
    outDir: path.resolve(__dirname, "dist"),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "src/index.html"),
        listing: path.resolve(__dirname, "src/listing.html"),
        logIn: path.resolve(__dirname, "src/login.html"),
        myProfile: path.resolve(__dirname, "src/myprofile.html"),
        newListing: path.resolve(__dirname, "src/newlisting.html"),
        profile: path.resolve(__dirname, "src/profile.html"),
        signUp: path.resolve(__dirname, "src/signup.html"),
      },
    },
  },
};
