import { extendTheme } from "native-base";
import colors from "./colors";

export const customTheme = extendTheme({
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    black: colors.black,
    white: colors.white,
  },
});
