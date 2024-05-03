"use client";

import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { HTMLAttributes, useRef } from "react";
import { useSelector } from "react-redux";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import StoreProvider from "./StoreProvider";
import { userToken } from "src/lib/redux/features/app/appSlice";
import { darkMode } from "src/lib/redux/features/theme/themeSlice";

interface BodyProps extends HTMLAttributes<HTMLBodyElement> {}

const Body: React.FC<BodyProps> = ({ className, children, ...props }) => {
  const uToken = useSelector(userToken);
  const isDark = useSelector(darkMode);

  const theme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
    },
  });

  return (
    <StoreProvider>
      <AppRouterCacheProvider options={{
        speedy: true,
        enableCssLayer: true,
      }}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <body className={`${className} ${isDark && "dark"}`} {...props}>
            {uToken && (
              <div>
                
              </div>
            )}
            <main className="p-4 dark:bg-zinc-900">{children}</main>
          </body>
        </ThemeProvider>
      </StyledEngineProvider>
      </AppRouterCacheProvider>
      </StoreProvider>
  );
};

export default Body;
