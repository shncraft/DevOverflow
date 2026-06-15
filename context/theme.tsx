import {
  ThemeProviderProps,
  ThemeProvider as NextThemesProdiver,
} from "next-themes";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProdiver {...props}>{children}</NextThemesProdiver>;
};

export default ThemeProvider;
