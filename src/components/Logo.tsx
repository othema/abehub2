import { Group, Text, useMantineTheme } from "@mantine/core";

function Logo({ small = false } : { small?: boolean }) {
	const theme = useMantineTheme();

	return (
		<Group spacing={small ? 4 : 8}>
			<Text color={theme.colorScheme === "dark" ? "white" : "black"} weight="bolder" size={small ? 17 : 23}>
        Abe
      </Text>
      <Text
        color="black"
        weight="bolder"
        size={small ? 17 : 23 }
        style={{
          backgroundColor: theme.colorScheme === "dark" ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][6],
          padding: `${small ? 1 : 2}px ${small ? 4 : 6}px`,
          borderRadius: theme.radius.sm,
        }}
      >
        hub
			</Text>
    </Group>
  );
}

export default Logo;