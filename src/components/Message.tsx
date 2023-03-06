import { useMantineTheme } from "@mantine/core";
import { pb } from "../lib/pocketbase";

export interface IMessageProps {
	data: any;
	last?: boolean
}

function Message({ data, last = true }: IMessageProps) {
	const theme = useMantineTheme();
	const isAuthor = data?.from === pb.authStore.model?.id;

	const radius = theme.radius.xl;

	return (
		<div
			style={{
				backgroundColor: isAuthor ? (theme.colorScheme === "dark" ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][6]) : (theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]),
				maxWidth: 450,
				width: "max-content",

				padding: "5px 10px",
				color: theme.colorScheme === "dark" ? theme.white : theme.black,
				borderRadius: last ? `${radius}px ${isAuthor ? 0 : radius}px ${!isAuthor ? 0 : radius}px ${radius}px` : radius,
				marginLeft: isAuthor ? "auto" : 0,
				marginRight: isAuthor ? 0 : "auto",
				marginBottom: 4
			}}
		>
			{data?.text}
		</div>
	);
}

export default Message;