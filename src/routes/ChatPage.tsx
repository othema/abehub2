import { Avatar, Button, Center, Divider, Group, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { IconCheck, IconChecks } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import NewChatModal from "../components/NewChatModal";
import { avatarUrl, getChatName, pb } from "../lib/pocketbase";

function ChatPage() {
	const { chatId } = useParams();
	const [chats, setChats] = useState<any>();
	const [newChatModalOpen, setNewChatModalOpen] = useState(false);

	useEffect(() => {
		(async () => {
			const c = await pb.collection("chats").getFullList(50, { $autoCancel: false, expand: "members" });
			setChats((a: any) => c);
		})();
	}, []);

	return (
		<Group style={{ height: "100%" }} position="center">
			<NewChatModal opened={newChatModalOpen} setOpened={setNewChatModalOpen} />
			<Paper withBorder style={{ height: "100%", width: 300 }} p="md" unstyled>
				<Button fullWidth variant="light" mb="md" onClick={() => setNewChatModalOpen(true)}>New chat</Button>
				{chats?.map((chat: any) => (
					<>
						<ChatListItem data={chat} />
						<Divider my="xs" />
					</>
				))}
			</Paper>
			<Paper withBorder style={{ height: "100%", width: "35%", minWidth: 600, overflow: "hidden" }} p="md">
				{chatId ? (
					<Outlet />
				) : (
					<Center style={{ height: "100%" }}>
						<Text color="dimmed">No chat open.</Text>
					</Center>
				)}
			</Paper>
		</Group>
	);
}

function ChatListItem({ data }: { data: any }) {
	const theme = useMantineTheme();
	return (
		<Link to={"/chat/" + data.id} style={{ textDecoration: "inherit", color: "inherit" }}>
			<Group p="sm" sx={(theme) => ({
				width: "100%",
				height: 60,
				borderRadius: theme.radius.sm,
				"&:hover": {
					backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1]
				}
			})} noWrap>
				<Avatar color="orange" radius="xl" src={avatarUrl(data.members.length)} />
				<div style={{  }}>
					<Text truncate weight="bold" mb={-5}>
						{getChatName(data)}
					</Text>
					<Group noWrap spacing={5} mt={-5}>
						{/* {lastMessage.read
							? (
								<IconChecks size={40} color={theme.primaryColor} />
							): (
								<IconCheck size={40} />
							)} */}
						
						<Text color="dimmed" size="sm" truncate>Last message</Text>
					</Group>
				</div>
			</Group>
		</Link>
  );
}

export default ChatPage;