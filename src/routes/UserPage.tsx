import { useParams } from "react-router-dom";
import { Text, Container, Tabs, Avatar, Title, Group, Button, Textarea, Divider, useMantineTheme } from "@mantine/core";
import { IconLayoutList, IconPencil, IconUserPlus, IconUsers, IconUserMinus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { avatarUrl, pb, PB_URL } from "../lib/pocketbase";

import Post from "../components/Post";
import { useMediaQuery } from "@mantine/hooks";
import { MOBILE, TABLET } from "../lib/mediaQueries";
import Loading from "../components/Loading";
import relativeDate from "../lib/readableDate";
import Verified from "../components/Verified";

function UserPage() {
	const { userId } = useParams();
	const theme = useMantineTheme();

	const [user, setUser] = useState<any>(null);
	const [posts, setPosts] = useState<any>(null);
	const [likedPosts, setLikedPosts] = useState<any>(null);

	const isOwner = userId == pb.authStore.model?.id;
	const [editMode, setEditMode] = useState(false);
	
	const [newAbout, setNewAbout] = useState("");

	const [followId, setFollowId] = useState<string | null>(null);
	const [followersAmount, setFollowersAmount] = useState(0);
	const [followingAmount, setFollowingAmount] = useState(0);

	const mobileScreen = useMediaQuery(MOBILE);
	const tabletScreen = useMediaQuery(TABLET);

	// TODO: Toggle follow

	async function toggleFollow() {
		if (followId) {
			setFollowersAmount(followersAmount - 1);
			await pb.collection("follows").delete(followId);
			setFollowId(null);
		} else {
			setFollowersAmount(followersAmount + 1);
			setFollowId((await pb.collection("follows").create({
				user: pb.authStore.model?.id,
				user2: userId
			})).id);
		}
	}

	async function getUser() {
		if (!userId) return;
		const u = await pb.collection("users").getOne(userId);
		setUser(u);
		setNewAbout(u.about);
	}

	async function getFollow() {  // Followers, following, if user is following
		if (!userId) return;
		const f = await pb.collection("follows").getFullList(100, { filter: `user2='${userId}'` });
		setFollowersAmount(f.length);
		setFollowingAmount((await pb.collection("follows").getFullList(100, { filter: `user='${userId}'` })).length);

		for (const follow of f) {
			console.log(follow, pb.authStore.model?.id);
			if (follow.user === pb.authStore.model?.id) {
				setFollowId(follow.id);
				break;
			}
		}
	}

	async function getPosts() {
		setPosts(await pb.collection("posts").getList(1, 20, { expand: "user,likes(post),posts(replying_to)", filter: "user='" + userId + "'", sort: "-created", $autoCancel: false }));
	}

	async function getLikedPosts() {
		setLikedPosts(await pb.collection("likes").getList(1, 20, { expand: "post.user,post.likes(post),post.posts(replying_to)", filter: "user='" + userId + "'", sort: "-created" }));
	}

	async function updateProfile() {
		if (!userId) return;
		await pb.collection("users").update(userId, {
			about: newAbout
		});
		setEditMode(false);
	}

	useEffect(() => {
		getUser();
		getFollow();
		getPosts();
		getLikedPosts();
		
	}, [userId]);

	return (
    <Container size="md" p={0}>
      <Group spacing={40} align="flex-start" noWrap={!tabletScreen}>
        <div
          style={{
            width: tabletScreen ? "100%" : 260,
            marginTop: 30,
            textAlign: tabletScreen ? "center" : "left",
          }}
        >
          <Avatar
            size={240}
            style={{
              marginLeft: tabletScreen ? "auto" : 0,
              marginRight: tabletScreen ? "auto" : 0,
              // maxWidth: 240,
              // maxHeight: 240,
              height: mobileScreen ? "85%" : 240,
              width: mobileScreen ? "85%" : 240,
            }}
            color={theme.primaryColor}
            radius={1000}
            src={avatarUrl(user, false)}
          >
            {user?.name[0].toUpperCase()}
          </Avatar>

          <Verified
            user={user}
            center={tabletScreen}
          >
            <Title order={1} size={30} mt="lg">
              {user?.name}
            </Title>
          </Verified>
          <Text color="dimmed" mt={-5} weight="bold">
            @{user?.username}
          </Text>
          <Text color="dimmed" size="sm">
            Joined {relativeDate(user?.created)}
          </Text>

          {isOwner ? (
            editMode ? (
              <></>
            ) : (
              <Button
                variant="light"
                mt="sm"
                fullWidth
                compact
                leftIcon={<IconPencil size={18} />}
                onClick={() => setEditMode(true)}
              >
                Edit profile
              </Button>
            )
          ) : (
            <Button
              variant="light"
              mt="sm"
              fullWidth
              compact
              leftIcon={
                followId ? (
                  <IconUserMinus size={18} />
                ) : (
                  <IconUserPlus size={18} />
                )
              }
              onClick={toggleFollow}
            >
              {followId ? "Unfollow" : "Follow"}
            </Button>
          )}

          <Group
            mt="xs"
            style={{
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.gray[6]
                  : theme.colors.gray[7],
            }}
            position={tabletScreen ? "center" : "left"}
          >
            <IconUsers size={17} />
            <Text>
              <b
                style={{
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[5]
                      : theme.colors.gray[7],
                }}
              >
                {followersAmount}
              </b>{" "}
              followers ·{" "}
              <b
                style={{
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.gray[5]
                      : theme.colors.gray[7],
                }}
              >
                {followingAmount}
              </b>{" "}
              following
            </Text>
          </Group>

          <Divider my="md" />

          <Title order={2} size="sm" mb={editMode ? 4 : -7}>
            About
          </Title>
          <Textarea
            variant={editMode ? "default" : "unstyled"}
            autosize
            minRows={editMode ? 4 : 0}
            placeholder={
              editMode
                ? "Write a little something about you..."
                : "This user likes to keep an air of mystery about them..."
            }
            value={newAbout}
            onChange={(e) => setNewAbout(e.target.value)}
            maxLength={160}
            readOnly={!editMode}
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {user?.about}
          </Textarea>

          {editMode ? (
            <Group mt="sm">
              <Button compact onClick={updateProfile}>
                Save changes
              </Button>
              <Button
                compact
                variant="subtle"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Group>
          ) : (
            <></>
          )}
        </div>
        <Tabs
          defaultValue="posts"
          style={{ flexGrow: 1, alignSelf: "flex-start" }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="posts" icon={<IconLayoutList size={14} />}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab value="likes" icon={<IconUsers size={14} />}>
              Liked posts
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts" pt="xs">
            {posts ? (
              posts.items.length == 0 ? (
                <Text color="dimmed" ta="center">
                  Bro really hasn't posted on the hit social media Abehub 😐
                </Text>
              ) : (
                posts.items.map((post: any) => (
                  <Post data={post} deleteCallback={getPosts} key={post.id} />
                ))
              )
            ) : (
              <Loading />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="likes" pt="xs">
            {likedPosts ? (
              likedPosts.items.length == 0 ? (
                <Text color="dimmed" ta="center">
                  No liked posts.
                </Text>
              ) : (
                likedPosts.items.map((like: any) => (
                  <Post
                    data={like.expand.post}
                    deleteCallback={getLikedPosts}
                    key={like.id}
                  />
                ))
              )
            ) : (
              <Loading />
            )}
          </Tabs.Panel>
        </Tabs>
      </Group>
    </Container>
  );
}

export default UserPage;