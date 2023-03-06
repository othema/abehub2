import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
	LoadingOverlay
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { IconUser, IconPassword } from "@tabler/icons-react";

import { Link } from "react-router-dom";
import { login, pb } from "../lib/pocketbase";
import { ClientResponseError } from "pocketbase";
import { useState } from "react";

export default function Login() {
  const form = useForm({
    initialValues: {
      identity: "",
      password: "",
      remember: false,
    }
  });

	const postForm = async (values: any) => {
		setLoading(true);
		try {
			await login(values.identity, values.password);
		} catch (err) {
			if (!(err instanceof ClientResponseError)) return;
			if (err.status === 400) {
				form.setFieldError("identity", "Invalid username or password");
				form.setFieldError("password", "Invalid username or password");
				form.setFieldValue("password", "");
      }
		}
		setLoading(false);
	};
	
	const [loading, setLoading] = useState(false);

  return (
		<Container size={420} my={40} p={0}>
			<Title
				align="center"
				sx={(theme) => ({
					fontFamily: `Greycliff CF, ${theme.fontFamily}`,
					fontWeight: 900,
				})}
			>
				Welcome back!
			</Title>

			<Text color="dimmed" size="sm" align="center" mt={5}>
				Don't have an account yet?{" "}
				<Anchor size="sm" component={Link} to="/signup">
					Create account
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
				<LoadingOverlay visible={loading} />
				<form onSubmit={form.onSubmit((values: any) => postForm(values))}>
					<TextInput
						label="Email or username"
						placeholder="abs@kebabs.com"
						icon={<IconUser size={14} />}
						required
						{...form.getInputProps("identity")}
					/>
					<PasswordInput
						label="Password"
						placeholder="Your password"
						icon={<IconPassword size={14} />}
						required
						mt="md"
						{...form.getInputProps("password")}
					/>

					<Group position="apart" mt="md">
						<Checkbox
							label="Remember me"
							{...form.getInputProps("remember")}
						/>
						<Anchor size="sm">Forgot password?</Anchor>
					</Group>

					<Button type="submit" fullWidth mt="xl">
						Login
					</Button>
				</form>
			</Paper>
		</Container>
  );
}
