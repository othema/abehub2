import {
  Avatar,
  Paper,
  Textarea,
  Group,
  Text,
  Button,
  Divider,
	LoadingOverlay,
	useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { avatarUrl, pb, PB_URL } from "../lib/pocketbase";
import Verified from "./Verified";

function WriteComment({ callback, replying }: { callback?: () => void, replying: string }) {
  const form = useForm({
    initialValues: {
      content: "",
    },
    validate: {
      content: (value) =>
        value.length >= 1 && value.length <= 280
          ? null
          : "Comment has to be between 1-280 characters",
    },
  });

  async function postForm(values: any) {
		if (!pb.authStore.model) return;
		setLoading(true);
    await pb.collection("posts").create({
      text: values.content,
			user: pb.authStore.model.id,
			replying_to: replying
    });
		callback?.();
		form.setFieldValue("content", "");
		setLoading(false);
	}
	
	const [loading, setLoading] = useState(false);
	const theme = useMantineTheme();

  return (
    <form onSubmit={form.onSubmit((values) => postForm(values))}>
			<Paper p="md" mb="md" shadow="sm" pos="relative">
				<LoadingOverlay visible={loading} />
        <Group>
          <Avatar radius="xl" color={theme.primaryColor} src={avatarUrl(pb.authStore.model)}>
            {pb.authStore.model?.name[0].toUpperCase()}
					</Avatar>
					<Verified user={pb.authStore.model} size={15} spacing={4}>
						<Text size="sm">{pb.authStore.model?.name}</Text>
					</Verified>
        </Group>

        <Textarea
          ml={54}
          autosize
          minRows={1}
          maxLength={280}
          placeholder="Write a comment..."
          variant="unstyled"
          {...form.getInputProps("content")}
        />

        <Divider />

        <Group position="right" mt="sm">
          <Button type="submit" radius="xl">
            Reply
          </Button>
        </Group>
      </Paper>
    </form>
  );
}

export default WriteComment;
