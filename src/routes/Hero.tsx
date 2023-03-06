import { Container, Image, Title, useMantineTheme, Text, Group, Paper, Anchor, Button, Divider, Blockquote } from "@mantine/core";
import { IconBolt, IconLock, IconMoodEmpty } from "@tabler/icons-react";
import Logo from "../components/Logo";
import GradientText from "../components/GradientText";
import { pb } from "../lib/pocketbase";
import { Link } from "react-router-dom";

import lightPosts from "../../public/img/posts-light.png";
import darkPosts from "../../public/img/posts-dark.png";

function Hero() {
	if (pb.authStore.model) {
    window.location.replace("/home");
    return <></>;
	}
	
	const theme = useMantineTheme();

	return (
    <Container size="md" p={0}>
			<Paper
				radius="lg"
				mt="xl"
				p="md"
				shadow="xl"
        style={{
          height: 400,
          backgroundImage: theme.fn.linearGradient(
            180,
						theme.colorScheme === "dark" ? theme.colors.gray[8] : theme.colors.gray[1],
						theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[4],
					),
          overflow: "hidden",
        }}
      >
        <Logo small />
        <Title ta="center" mt={20} size={45}>
					Introducing{" "}
					<GradientText
						start={theme.colorScheme === "dark" ? theme.colors.orange[8] : theme.colors.orange[7]}
						end={theme.colorScheme === "dark" ? theme.colors.orange[7] : theme.colors.orange[6]}
						deg={90}
					>
						Abehub 2
					</GradientText>.
        </Title>

        <Image
          src={theme.colorScheme === "dark" ? darkPosts : lightPosts}
          width={300}
          mx="auto"
          mt={13}
          alt="Posts sample"
        />
      </Paper>
			
			<Group mt={70} mx="auto" spacing={40} position="center" >
				<Paper ta="center" p="md" withBorder shadow="md" radius="lg" style={{ width: 215, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1] }}>
					<IconBolt size={50} color={theme.colors.orange[6]} />
					<Title order={1} size={23}>Fast</Title>
					<Text size="sm">Abehub 2 has up to 20x faster load times compared to Abehub 1.</Text>
				</Paper>
				<Paper ta="center" shadow="md" p="md" withBorder radius="lg" style={{ width: 215, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1] }}>
					<IconLock size={50} color={theme.colors.orange[6]}  />
					<Title order={1} size={23}>Secure</Title>
					<Text size="sm">Security is Abehub 2's main priority. You're safe in our hands.</Text>
				</Paper>
				<Paper ta="center" shadow="md" p="md" withBorder radius="lg" style={{ width: 215, backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1] }}>
					<IconMoodEmpty size={50} color={theme.colors.orange[6]} />
					<Title order={1} size={23}>Greg Hubris</Title>
					<Text size="sm">
						I don't know what to put in here so I am just going to plug this <Anchor target="_blank" href="https://www.youtube.com/@greghubris4161/">YouTube channel</Anchor>.
					</Text>
				</Paper>
			</Group>
			<Text size="lg" ta="center" mx="auto" mt={30} style={{ width: "100%", maxWidth: 700 }}>
				Abehub 2 combines performance with elegance to offer a premium social media experience to all of its users.
			</Text>

			<Title ta="center" mt={70}>Testimonials</Title>
			<Divider mt={5} mb={5} style={{ width: 75, borderRadius: "1000px" }} size="lg" mx="auto" />
			<Group position="center">
				<Blockquote cite="– Emily Brealey" color={theme.colors.orange[6]} style={{ width: 400}}>
					My second favourite website with a black and orange colour scheme.
				</Blockquote>

				<Blockquote cite="– Max Elia" color={theme.colors.orange[6]} style={{ width: 400}}>
					The quote finds you when the hubris finds you.
				</Blockquote>
			</Group>

			<Title ta="center" mt={70}>Get started now</Title>
			<Divider mt={5} mb={18} style={{ width: 75, borderRadius: "1000px" }} size="lg" mx="auto" />
			<Group mx="auto" mb={70} grow style={{ width: "100%", maxWidth: 400 }}>
				<Button component={Link} to="/signup" radius="xl">Sign up</Button>
				<Button component={Link} to="/login" radius="xl">Login</Button>
			</Group>
    </Container>
  );
}

export default Hero;