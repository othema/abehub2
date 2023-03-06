import { Avatar, Paper, Textarea, Group, Text, useMantineTheme, Button, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { avatarUrl, pb, PB_URL } from "../lib/pocketbase";
import Verified from "./Verified";

function WritePost({ callback }: { callback?: () => void }) {
	const form = useForm({
		initialValues: {
			content: ""
		},
		validate: {
			content: (value) => value.length >= 1 && value.length <= 280 ? null : "Post has to be between 1-280 characters"
		}
	});

	async function postForm(values: any) {
		if (!pb.authStore.model) return;
		await pb.collection("posts").create({
			text: values.content,
			user: pb.authStore.model.id
		});
		callback?.();
		form.setFieldValue("content", "");
	}

	return (
    <form onSubmit={form.onSubmit((values) => postForm(values))}>
      <Paper withBorder p="md" shadow="sm">
        <Group>
          <Avatar
            radius="xl"
            color="orange"
            src={avatarUrl(pb.authStore.model)}
          >
            {pb.authStore.model?.name[0].toUpperCase()}
					</Avatar>
					<Verified user={pb.authStore.model} size={15} spacing={4}>
						<Text size="sm">{pb.authStore.model?.name}</Text>
					</Verified>
        </Group>

        <Textarea
          ml={54}
          autosize
          minRows={4}
          maxLength={280}
          placeholder="Speak out..."
          variant="unstyled"
          {...form.getInputProps("content")}
        />

        <Divider />

        <Group position="right" mt="sm">
          <Button type="submit" radius="xl">
            Post
          </Button>
        </Group>
      </Paper>
    </form>
  );
}

export default WritePost;