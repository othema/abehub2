import { AppShell, ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { Outlet } from "react-router-dom";

import LoggedInNavbar from "./components/LoggedInNavbar";
import LoggedOutNavbar from "./components/LoggedOutNavbar";
import { pb } from "./lib/pocketbase";
import "./css/greycliff.css";
import { useState } from "react";

function Layout() {
	const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
	const toggleColorScheme = (value?: ColorScheme) => { setColorScheme(value || (colorScheme === "dark" ? "light" : "dark")) }

	return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          primaryColor: "orange",
          headings: {
            fontFamily: "Greycliff CF",
          },
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppShell
          padding="md"
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
          navbar={pb.authStore.model ? <LoggedInNavbar /> : <LoggedOutNavbar />}
        >
          <Outlet />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default Layout;