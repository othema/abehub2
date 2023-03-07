import { useMantineTheme, Group, Avatar, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { avatarUrl, pb } from "../lib/pocketbase";

export interface IMessageProps {
	data: any;
	last?: boolean
}

function Message({ data, last = true }: IMessageProps) {
	const theme = useMantineTheme();
	const isAuthor = data?.from === pb.authStore.model?.id;

	const radius = theme.radius.lg;

	const avatar = last ? (
		<Tooltip label={data?.expand.from.name}>
			<Link to={"/users/" + data?.expand.from.id} style={{ color: "inherit", textDecoration: "inherit" }}>
				<Avatar color="orange" src={avatarUrl(data?.expand.from)} radius="xl">{data?.expand.from.name[0].toUpperCase()}</Avatar>
			</Link>
		</Tooltip>
	) : <></>;

	return (
		<Group spacing="sm" mb={last ? 10 : 4}>
			{!isAuthor ? avatar : <></>}
			<div
				style={{
					backgroundColor: isAuthor ? (theme.colorScheme === "dark" ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][6]) : (theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]),
					maxWidth: 450,
					width: "max-content",

					padding: "5px 10px",
					color: theme.colorScheme === "dark" ? theme.white : theme.black,
					borderRadius: last ? `${!isAuthor ? 0 : radius}px ${isAuthor ? 0 : radius}px ${radius}px ${radius}px` : radius,
					marginLeft: isAuthor ? "auto" : (last ? 0 : 50),
					marginRight: isAuthor ? (last ? 0 : 50) : "auto",
					marginBottom: 0
				}}
			>
				{data?.text}
			</div>
			{isAuthor ? avatar : <></>}
		</Group>
	);
}

export default Message;