import { extendTheme } from "native-base";
import colors from "./colors";

export const customTheme = extendTheme({
  colors: {
    primary: colors.primary,
    neutral: colors.neutral,
    status: colors.status
  },
});
