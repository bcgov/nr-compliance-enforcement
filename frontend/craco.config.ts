// craco.config.ts

import path from "path";

const config = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
      "@common": path.resolve(__dirname, "src/app/common/"),
      "@components": path.resolve(__dirname, "src/app/components/"),
      "@constants": path.resolve(__dirname, "src/app/constants/"),
      "@hooks": path.resolve(__dirname, "src/app/hooks/"),
      "@providers": path.resolve(__dirname, "src/app/providers/"),
      "@service": path.resolve(__dirname, "src/app/service/"),
      "@store": path.resolve(__dirname, "src/app/store/"),
      "@apptypes": path.resolve(__dirname, "src/app/types/"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "@assets(.*)$": "<rootDir>/src/assets$1",
        "@common(.*)$": "<rootDir>/src/app/common$1",
        "@components(.*)$": "<rootDir>/src/app/components$1",
        "@constants(.*)$": "<rootDir>/src/app/constants$1",
        "@hooks(.*)$": "<rootDir>/src/app/hooks$1",
        "@providers(.*)$": "<rootDir>/src/app/providers$1",
        "@service(.*)$": "<rootDir>/src/app/service$1",
        "@store(.*)$": "<rootDir>/src/app/store$1",
        "@apptypes(.*)$": "<rootDir>/src/app/types$1",
      },
    },
  },
};

export default config;
