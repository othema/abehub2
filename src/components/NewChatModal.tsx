import { Modal, useMantineTheme, Chip, Group, Text, MultiSelect, Button, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";

export interface INewChatModalProps {
	setOpened: (open: boolean) => void;
	opened: boolean;
}

function NewChatModal ({ opened, setOpened }: INewChatModalProps) {
	const theme = useMantineTheme();

	const [users, setUsers] = useState<any>([]);
	const [chatType, setChatType] = useState("chat");

	const [chatUserID, setChatUserID] = useState("");
	const [newGroupUserID, setNewGroupUserID] = useDebouncedState("", 200);

	async function postForm() {
		// if (!)
	}

	return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="New chat"
      exitTransitionDuration={300}
      radius="md"
      size="sm"
      centered
    >
			<form onSubmit={(e) => { e.preventDefault(); postForm() }}>
        <Group mb="xs">
          <Text>Chat type</Text>
          <Chip.Group defaultValue={chatType} value={chatType} onChange={setChatType}>
            <Chip value="chat">Chat</Chip>
            <Chip value="group">Group</Chip>
          </Chip.Group>
				</Group>
				{chatType === "group" ? (
					<MultiSelect
						label="User IDs"
						placeholder="All group user IDs..."
						style={{ width: "100%" }}
						data={[]}
						searchable
						creatable
						getCreateLabel={(query) => {
							setNewGroupUserID(query);  // TODO: Show user name and username on debounced state
							return `+ Add ${query}`;
						}}
						onCreate={(query) => {
							const item = { value: query, label: query };
							setUsers((current: any) => [...current, item]);
							return item;
						}}
					/>
				): (
					<TextInput
						label="User ID"
						placeholder="User ID..."
						value={chatUserID}
						onChange={(e) => setChatUserID(e.currentTarget.value)}
					/>
				)}
        
				<Button fullWidth mt="lg">Create</Button>
      </form>
    </Modal>
  );
}

export default NewChatModal;