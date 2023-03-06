import { Modal, Group, Switch, Text, useMantineColorScheme, useMantineTheme } from "@mantine/core";

export interface ISettingsModalProps {
	setOpened: (open: boolean) => void;
	opened: boolean;
}

function SettingsModal({ opened, setOpened }: ISettingsModalProps) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const theme = useMantineTheme();

	return (
		<Modal
			opened={opened}
			onClose={() => setOpened(false)}
			title="Settings"
			exitTransitionDuration={300}
			radius="md"
			size="sm"
			centered
		>
			<Group
				p="sm"
				position="apart"
				style={{
					backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
					borderRadius: theme.radius.md,
					cursor: "pointer"
				}}
				onClick={() => toggleColorScheme()}
			>
				<Text>Dark mode</Text>
				<Switch
					checked={colorScheme === "dark"}
					style={{ pointerEvents: "none" }}
					size="sm"
				/>
			</Group>
		</Modal>
	);
}

export default SettingsModal;