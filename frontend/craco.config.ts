// craco.config.ts

import path from "path";

const config = {
  webpack: {
    alias: {
      "@components": path.resolve(__dirname, "src/app/components/"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "@components(.*)$": "<rootDir>/src/app/components$1",
      },
    },
  },
};

export default config;
