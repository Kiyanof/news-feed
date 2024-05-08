"use client";

import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { HTMLAttributes, useRef } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import MainNav from "./components/navs/MainNav";

interface BodyProps extends HTMLAttributes<HTMLBodyElement> {}

const Body: React.FC<BodyProps> = ({ className, children, ...props }) => {
  const isDark = false; // TODO: useSelector(darkMode);

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      // TODO: Change primary and secondary colors
    },
    typography: {
      fontFamily: "serif",
    },
  });

  return (
    <AppRouterCacheProvider
      options={{
        speedy: true,
        enableCssLayer: true,
      }}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <body className={`${className} ${isDark && "dark"}`} {...props}>
            <nav className="h-fit">
              <MainNav />
            </nav>
            <main className="tw-overflow-y-auto p-4 dark:bg-zinc-900 tw-mt-[66px] tw-absolute tw-left-0 tw-top-0 tw-bottom-0 tw-right-0">
              {children}
            </main>
          </body>
        </ThemeProvider>
      </StyledEngineProvider>
    </AppRouterCacheProvider>
  );
};

export default Body;
