import mantine from "eslint-config-mantine";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(...mantine, {
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    "no-console": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  ignores: ["**/*.{mjs,cjs,js,d.ts,d.mts}", "./.storybook/main.ts"],
});
