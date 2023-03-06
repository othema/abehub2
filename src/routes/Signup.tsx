import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
	Group,
	LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ClientResponseError } from "pocketbase";

import { IconUser, IconMail, IconPassword } from "@tabler/icons-react";

import { Link } from "react-router-dom";
import { signUp } from "../lib/pocketbase";
import { useState } from "react";

export default function Signup() {
  const form = useForm({
    initialValues: {
      username: "",
			email: "",
			firstName: "",
			lastName: "",
			password: "",
			passwordConfirm: "",
      remember: false,
    },
    validate: {
      username: (value) =>
        /^(?=[a-zA-Z0-9._]{3,17}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value)
          ? null
          : "Invalid username",
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
			firstName: (value) => 2 <= value.length && 10 >= value.length ? null : "Invalid first name",
			lastName: (value) => 2 <= value.length && 10 >= value.length ? null : "Invalid last name",
			password: (value) => value.length >= 8 ? null : "Password must be more than 8 characters",
			passwordConfirm: (value) => value.length >= 8 ? null : "Passwords do not match"
    },
  });

	const postForm = async (values: any) => {
		setLoading(true);
		try {
			await signUp(values.username, values.password, values.passwordConfirm, values.email, values.firstName + " " + values.lastName);
		} catch (err) {
			if (!(err instanceof ClientResponseError)) return;
			if (err.status === 400) {
				for (const [key, value] of Object.entries(err.data.data)) {
					form.setFieldError(key, value.message);
				}
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
        Create an account
      </Title>

      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Login
        </Anchor>
      </Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
				<LoadingOverlay visible={loading} />
        <form onSubmit={form.onSubmit((values) => postForm(values))}>
          <TextInput
            label="Username"
            placeholder="abefan123"
            required
            icon={<IconUser size={14} />}
            {...form.getInputProps("username")}
          />
          <TextInput
            label="Email"
            placeholder="abs@kebabs.com"
            required
            mt="md"
            icon={<IconMail size={14} />}
            {...form.getInputProps("email")}
          />
          <Group noWrap>
            <TextInput
              label="First name"
              placeholder="Daniel"
              required
              mt="md"
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label="Last name"
              placeholder="George"
              required
              mt="md"
              {...form.getInputProps("lastName")}
            />
          </Group>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            icon={<IconPassword size={14} />}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Retype your password"
            required
            mt="md"
            icon={<IconPassword size={14} />}
            {...form.getInputProps("passwordConfirm")}
          />

          <Checkbox
            label="Remember me"
            mt="md"
            {...form.getInputProps("remember")}
          />

          <Button type="submit" fullWidth mt="xl">
            Create account
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
