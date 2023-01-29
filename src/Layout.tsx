import { AppShell, MantineProvider } from "@mantine/core";
import { Outlet } from "react-router-dom";

function Layout () {
	return (
		<MantineProvider theme={{ colorScheme: "dark" }} withGlobalStyles withNormalizeCSS>
			<AppShell
				padding="md"
				styles={(theme) => ({
					main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] }
				})}
			>
				<Outlet />
			</AppShell>
		</MantineProvider>
	);
}

export default Layout;