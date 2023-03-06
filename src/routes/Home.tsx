import { Container, Divider, Tabs, Text, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { logOut, pb } from "../lib/pocketbase";

import { IconSearch, IconUser } from "@tabler/icons-react";

import Post from "../components/Post";
import WritePost from "../components/WritePost";
import Loading from "../components/Loading";


function Home() {
	if (!pb.authStore.model) {
		window.location.replace("/login");
		return <></>;
	}

	useEffect(() => {
		loadPosts();
	}, []);

	const [forYou, setForYou] = useState<any>(null);
	const [explore, setExplore] = useState<any>(null);

	async function loadPosts() {
		// TODO: Add following posts through an expand
		const following = await pb.collection("follows").getFullList(100, { filter: `user='${pb.authStore.model?.id}'` });
		let filter;
		if (following.length == 0)
			filter = `user='${pb.authStore.model?.id}'`;
		else
			filter = following.map((follow) => `user='${follow.user2}'`).join("||") + `||user='${pb.authStore.model?.id}'`;

		setForYou(
			await pb.collection("posts").getList(1, 20, {
				sort: "-created",
				filter: filter,
				expand: "user,likes(post),posts(replying_to)",
				$autoCancel: false
			})
		);
		
		setExplore(
      await pb.collection("posts").getList(1, 20, {
        sort: "-created",
        expand: "user,likes(post),posts(replying_to)",
        $autoCancel: false,
      })
    );
	}

	return (
    <Container size="xs" p={0}>
      <Tabs defaultValue="home" variant="pills">
        <Tabs.List grow>
          <Tooltip.Group openDelay={500} closeDelay={100}>
            <Tooltip label="See posts from people you follow">
              <Tabs.Tab value="home" icon={<IconUser size={14} />}>
                For you
              </Tabs.Tab>
            </Tooltip>
            <Tooltip label="See posts from all users">
              <Tabs.Tab value="explore" icon={<IconSearch size={14} />}>
                Explore
              </Tabs.Tab>
            </Tooltip>
          </Tooltip.Group>
        </Tabs.List>

        <Tabs.Panel value="home" mt="md">
          <WritePost callback={loadPosts} />

          <Divider my="lg" />

          {forYou ? (
            forYou.items.length == 0 ? (
              <Text color="dimmed" ta="center">
                Follow some people!
              </Text>
            ) : (
              forYou.items.map((post: any) => (
                <Post data={post} deleteCallback={loadPosts} key={post.id} />
              ))
            )
          ) : (
            <Loading />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="explore" mt="md">
          <WritePost callback={loadPosts} />

          <Divider my="lg" />

          {explore ? (
            explore.items.length == 0 ? (
              <Text color="dimmed" ta="center">
                No posts to show.
              </Text>
            ) : (
              explore.items.map((post: any) => (
                <Post data={post} deleteCallback={loadPosts} key={post.id} />
              ))
            )
          ) : (
            <Loading />
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default Home;