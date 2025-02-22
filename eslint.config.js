import { hope } from "eslint-config-mister-hope";

export default hope({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ["eslint.config.js"],
      },
    },
  },
  ts: {
    "no-console": "off",
  },
});
