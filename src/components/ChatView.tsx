import { Title, Group, Avatar, useMantineTheme, Text, Divider, Skeleton, ScrollArea, TextInput, ActionIcon, Stack } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { avatarUrl, pb } from "../lib/pocketbase";
import Message from "./Message";
import Verified from "./Verified";

/*
const resultList = await pb.collection("messages").getList(1, 50, {
	sort: "created",
	expand: "user"
});

messages = resultList.items;

unsubscribe = await pb.collection("messages").subscribe("*", async ({ action, record }) => {
	if (action === "create") {
		console.log(record);
		const user = await pb.collection("users").getOne(record.user);
		record.expand = { user };
		messages = [...messages, record]
	} else if (action === "delete") {
		messages = messages.filter((m) => m.id !== record.id);
	}
});
*/

function ChatView() {
	const { chatId } = useParams();
	const [chatData, setChatData] = useState<any>(null);
	const theme = useMantineTheme();

	const [messagesPage, setMessagesPage] = useState<any>(null);
	const [messages, setMessages] = useState<any>(null);
	const [newMessage, setNewMessage] = useState("");

	const chatView = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const filter = `chat = '${chatId}'`;
		(async () => {
			if (!chatId) return;

			setChatData(await pb.collection("chats").getOne(chatId, { $autoCancel: false, expand: "members" }));
			const m = await pb.collection("messages").getList(-1, 50, { filter: filter, sort: "created", $autoCancel: false });
			setMessagesPage(m);
			setMessages(m.items);
		
			await pb.collection("messages").subscribe("*", async ({ action, record }) => {
				setMessages((oldMessages: any) => [...oldMessages, record]);
			});
		})();
		return () => { pb.collection("messages").unsubscribe("*"); console.log("hi") }
	}, [chatId]);

	async function postMessage() {
		if (!chatData) return;
		await pb.collection("messages").create({
			from: pb.authStore.model?.id,
			chat: chatData.id,
			text: newMessage
		});
		chatView.current?.scrollTo({ top: chatView.current.scrollHeight, behavior: "smooth" });
		setNewMessage("");
	}

	const members = chatData?.expand?.members;
	const isGroup = members?.length > 2;
	const placeholder = isGroup ? "Write a message..." : "Message " + members?.[0].name + "...";
	const otherUser = !isGroup ? (members?.[0].id == pb.authStore.model?.id ? members?.[1] : members?.[0]) : null;
	const chatName = isGroup ? `${members?.[0].name.split(" ")[0]}, ${members?.[1].name.split(" ")[0]} +${members?.length - 2}` : otherUser?.name.split()[0];

	return (
		<Stack spacing="xs" style={{ height: "100%", overflow: "hidden" }}>
			<div>
				<Link style={{ textDecoration: "inherit", color: "inherit" }} to={"/users/" + chatData?.id}>
					<Group>
						<Skeleton visible={!chatData} radius="xl" width={40} height={40}>
							<Avatar radius="xl" color={theme.primaryColor}>{chatData?.members.length}</Avatar>
						</Skeleton>
						<div>
							<Skeleton visible={!chatData} height={chatData ? "auto" : 18} width={chatData ? "auto" : 150}>
								<Verified user={chatData} size={20} spacing={4}>
									<Title order={1} size={20}>{chatName}</Title>
								</Verified>
							</Skeleton>
							<Skeleton visible={!chatData} height={chatData ? "auto" : 15} width={chatData ? "auto" : 100} mt={chatData ? 0 : 5}>
								<Text size="sm" color="dimmed" truncate>{isGroup ? `Group with ${members?.length} members` : `Chat with ${otherUser?.name}`}</Text>
							</Skeleton>
						</div>
					</Group>
				</Link>
				<Divider my="sm" />
			</div>
			<ScrollArea style={{ flexGrow: 1 }} h={0} px="md" viewportRef={chatView}>
				{messages?.map((message: any, i: number) => {
					let last = true;
					const next = messages[i + 1];
					last = next?.from !== message?.from;
					return <Message data={message} key={message.id} last={last} />;
				})}
			</ScrollArea>
			<form onSubmit={(e) => { e.preventDefault(); postMessage() }}>
				<TextInput
					placeholder={chatData ? placeholder : ""}
					rightSection={(
						<ActionIcon size="sm" disabled={newMessage.trim().length == 0}>
							<IconSend />
						</ActionIcon>
					)}
					value={newMessage}
					onChange={(e) => setNewMessage(e.currentTarget.value)}
				/>
			</form>
		</Stack>
	);
}

export default ChatView;