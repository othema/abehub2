import { Alert, Avatar, Group, Header, Menu, Text, Anchor, TextInput, Autocomplete, useMantineTheme, Box, Loader, Button} from "@mantine/core";
import { useDebouncedState, useMediaQuery } from "@mantine/hooks";
import { IconLogout, IconUser, IconSettings, IconQuestionMark, IconMessageDots, IconSearch } from "@tabler/icons-react";
import { forwardRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MOBILE } from "../lib/mediaQueries";
import { avatarUrl, logOut, pb, PB_URL } from "../lib/pocketbase";

import SettingsModal from "./SettingsModal";
import Logo from "./Logo";
import Verified from "./Verified";

function LoggedInNavbar() {
	const mobileScreen = useMediaQuery(MOBILE);

	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);

	const [userSearch, setUserSearch] = useDebouncedState("", 100);
	const [userAutocomplete, setUserAutocomplete] = useState<any>([]);
	const [loadingSearch, setLoadingSearch] = useState(false);
	
	const navigate = useNavigate();

	useEffect(() => {
		(async () => {
			const search = userSearch.trim();
			if (search == "") {
				setUserAutocomplete([]);
				return;
			};
			setLoadingSearch(true);
			const req = await pb.collection("users").getList(1, 5, { filter: `username ~ '${search}' || name ~ '${search}'` });
			setUserAutocomplete(req.items.map((item) => ({ ...item, value: item.name })));
			setLoadingSearch(false);
		})();
		
	}, [userSearch]);

	const theme = useMantineTheme();

	return (
    <Header height={60}>
      {/* <Alert
				variant="filled"
				radius={0}
				ta="center"
				p="xs"
				withCloseButton
				styles={(theme) => ({
					closeButton: {
						alignSelf: "left"
					}
				})}
			>
				Enjoy Abehub2 guys.
      </Alert> */}
      <SettingsModal opened={settingsOpen} setOpened={setSettingsOpen} />
      <div
        style={{
          width: "100%",
          paddingLeft: 30,
          paddingRight: 30,
          height: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1550,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Group>
          <Anchor to="/home" component={Link} underline={false}>
            <Logo />
          </Anchor>
        </Group>

        <Group
          style={{ height: "100%", display: mobileScreen ? "none" : "flex" }}
        >
          <Autocomplete
            style={{ maxWidth: 700, width: "40vw" }}
            placeholder="Search users..."
            icon={<IconSearch size={14} />}
            data={userAutocomplete}
            defaultValue={userSearch}
            onChange={setUserSearch}
            itemComponent={UserAutocomplete}
            onItemSubmit={(item) => {
              navigate("/users/" + item.id);
              setUserSearch("");
            }}
            nothingFound={
              <Text>
                {loadingSearch ? "Searching for" : "No results"} for '
                {userSearch}'
              </Text>
            }
            rightSection={loadingSearch ? <Loader size={20} /> : <></>}
          />
        </Group>

        <Group spacing="xl" style={{ height: "100%" }}>
          <Menu
            width={350}
            position="bottom-end"
            transition="pop-top-right"
            opened={notificationsOpen}
            onChange={setNotificationsOpen}
          >
            <Menu.Target>
              {!notificationsOpen ? (
                <IconMessageDots style={{ cursor: "pointer" }} />
              ) : (
                <IconMessageDots style={{ cursor: "pointer" }} />
              )}
            </Menu.Target>

						<Menu.Dropdown style={{ height: 300 }}>
							<Group position="apart">
								<Text mt={4} ml={8} weight="bold">
									Notifications
								</Text>
								<Button variant="light" compact component={Link} to="/chat">
									Go to chat
								</Button>
							</Group>
              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>

          <Menu
            width={200}
            position="bottom-end"
            transition="pop-top-right"
            shadow="sm"
          >
            <Menu.Target>
              <Avatar
                color={theme.primaryColor}
                radius="xl"
                style={{ cursor: "pointer" }}
                src={avatarUrl(pb.authStore.model)}
              >
                {pb.authStore.model?.name[0].toUpperCase()}
              </Avatar>
            </Menu.Target>

            <Menu.Dropdown>
              <Group ml="xs" spacing="xs" align="center">
                <Avatar
                  color={theme.primaryColor}
                  radius="xl"
                  style={{ cursor: "pointer", verticalAlign: "top" }}
                  src={avatarUrl(pb.authStore.model)}
                >
                  {pb.authStore.model?.name[0].toUpperCase()}
                </Avatar>
                <div>
                  <Text mt={10} weight="bold">
                    {pb.authStore.model?.name}
                  </Text>
                  <Text mt={-3} color="" size="xs" mb="sm">
                    @{pb.authStore.model?.username}
                  </Text>
                </div>
              </Group>

              <Menu.Divider />

              <Menu.Label>User</Menu.Label>
              <Menu.Item
                component={Link}
                to={"/users/" + pb.authStore.model?.id}
                py={7}
                icon={<IconUser size={14} />}
              >
                Your profile
              </Menu.Item>
              <Menu.Item
                component={Link}
                to="/chat"
                py={7}
                icon={<IconMessageDots size={14} />}
              >
                Direct messages
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Application</Menu.Label>
              <Menu.Item
                onClick={() => setSettingsOpen(true)}
                icon={<IconSettings size={14} />}
              >
                Settings
              </Menu.Item>
              <Menu.Item
                to="/home"
                py={7}
                component={Link}
                icon={<IconQuestionMark size={14} />}
              >
                About Abehub
              </Menu.Item>

              <Menu.Divider />
              <Menu.Item
                icon={<IconLogout size={14} />}
                color="red"
                onClick={logOut}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Header>
  );
}

const UserAutocomplete = forwardRef<HTMLDivElement>((data: any, ref) => {
	const theme = useMantineTheme();
	return (
		<Box ref={ref} p="xs" {...data.others} sx={(theme) => ({
			":hover": {
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[5]
						: theme.colors.gray[1],
			},
		})}>
      <Link
        to={"/users/" + data.id}
        style={{ textDecoration: "inherit", color: "inherit" }}
      >
        <Group
          noWrap
        >
          <Avatar src={avatarUrl(data)} radius="xl" color={theme.primaryColor} />
          <div>
            <Verified user={data} size={15} spacing={4}>
              <Text size="sm">{data.value}</Text>
            </Verified>
            <Text size="sm" color="dimmed">
              @{data.username}
            </Text>
          </div>
        </Group>
      </Link>
    </Box>
  );
})

export default LoggedInNavbar;