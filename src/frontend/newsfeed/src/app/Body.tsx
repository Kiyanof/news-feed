"use client";

import { darkMode } from "@/lib/features/theme/themeSlice";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { HTMLAttributes, useRef } from "react";
import { useSelector } from "react-redux";
import Navbar from "./component/Navbar/Navbar";
import { userToken } from "@/lib/features/app/appSlice";
import Sidebar from "./component/Sidebar/Sidebar";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

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
    <AppRouterCacheProvider options={{
      speedy: true,
      enableCssLayer: true,
    }}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <body className={`${className} ${isDark && "dark"}`} {...props}>
          {uToken && (
            <div>
              <Navbar />
              <Sidebar />
            </div>
          )}
          <main className="p-4 dark:bg-zinc-900">{children}</main>
        </body>
      </ThemeProvider>
    </StyledEngineProvider>
    </AppRouterCacheProvider>
  );
};

export default Body;
