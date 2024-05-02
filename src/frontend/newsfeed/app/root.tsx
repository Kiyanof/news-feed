import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "../public/css/main.css?url";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesheet }];
};

export function Layout({ children }: { children: React.ReactNode }) {

  const theme = createTheme({
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  })

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </StyledEngineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
