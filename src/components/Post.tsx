import { Avatar, Group, Paper, Text, useMantineTheme, ActionIcon, Anchor, Menu, Skeleton, LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconThumbUp, IconThumbUpFilled, IconMessageCircle2, IconShare, IconDots, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import regexifyString from "regexify-string";
import { MOBILE } from "../lib/mediaQueries";
import { avatarUrl, pb, PB_URL } from "../lib/pocketbase";
import readableDate from "../lib/readableDate";
import Verified from "./Verified";
import Embed from "react-embed";

function Post({ data, withBorder = false, margin = true, deleteCallback }: { data: any, withBorder?: boolean, margin?: boolean, deleteCallback?: () => void }) { // TODO: Type check
	const theme = useMantineTheme();

	const isOwner = pb.authStore.model?.id == data?.expand.user.id;
	const [liked, setLiked] = useState(false);
	const [likeId, setLikeId] = useState<string | null>(null);
	const [likeCount, setLikeCount] = useState(0);

	const [commentCount, setCommentCount] = useState(0);

	const postTime = readableDate(data?.created);
	const [loading, setLoading] = useState(false);

	const mobileScreen = useMediaQuery(MOBILE);

	async function deletePost() {
		setLoading(true);
		await pb.collection("posts").delete(data?.id);
		deleteCallback?.();
	}

	async function toggleLike() {
		if (liked) {
			if (!likeId) return;
			setLiked(false);
			setLikeCount(likeCount - 1);
			await pb.collection("likes").delete(likeId);
			
		} else {
			setLiked(true);
			setLikeCount(likeCount + 1)
			setLikeId((await pb.collection("likes").create({
        user: pb.authStore.model?.id,
        post: data?.id,
			})).id);
		}
	}

	function copyLink() {
		alert("Link copied to clipboard!")
	}

	useEffect(() => {
		const fetchData = async () => {
			if (!data) return;
			// Check if logged in user has liked post
			data.expand["likes(post)"].forEach((like: any) => {
				if (like.post === data.id) {
					setLikeId(like.id);
					setLiked(true);
				}
			});
			try { setLikeCount(data.expand["likes(post)"].length) } catch (_) { }
			try { setCommentCount(data.expand["posts(replying_to)"].length) } catch (_) { }
		}

		fetchData();
	}, [data]);

	return (
		<Paper
			mb={margin ? "md" : 0}
			shadow="sm"
			component={Link}
			to={"/posts/" + data?.id}
			withBorder={withBorder}
			sx={(theme) => ({
				padding: `${theme.spacing.md}px ${theme.spacing.md}px`,
				"&:hover": {
					backgroundColor: theme.colorScheme === "dark" ? theme.fn.darken(theme.colors.dark[6], 0.2) : theme.colors.gray[1]
				}
			})}
			pos="relative"
		>
			<LoadingOverlay visible={loading} />
			<Menu position="bottom-end" transition="pop-top-right" shadow="sm">
				<Menu.Target>
					<ActionIcon color="dark" size="sm" style={{ float: "right" }} onClick={(e: any) => e.preventDefault()}>
						<IconDots />
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item color="red" icon={<IconAlertTriangle size={14} />}>Report</Menu.Item>
					{isOwner ? <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={(e: any) => { e.preventDefault(); deletePost(); }}>Delete</Menu.Item> : <></>}
				</Menu.Dropdown>
			</Menu>
			<Group>
				<Link to={"/users/" + data?.expand.user.id} style={{ textDecoration: "none" }}>
					<Skeleton visible={!data} radius="xl">
						<Avatar radius="xl" src={avatarUrl(data?.expand.user)} color={theme.primaryColor}>
							{data?.expand.user.name[0].toUpperCase()}
						</Avatar>
					</Skeleton>
				</Link>
				<div>
					<Skeleton visible={!data} mb={!data ? 10 : -5} width={!data ? 150 : "100%"} height={!data ? 18 : 20}>
						<Verified user={data?.expand.user} size={15} spacing={4}>
							<Anchor to={"/users/" + data?.expand.user.id} size="sm" component={Link} display="block">{data?.expand.user.name}</Anchor>
						</Verified>
					</Skeleton>
					{data ? (
						<Anchor size="xs" color="dimmed" component={Link} to={"/posts/" + data?.id} display="inline">
							{postTime}
						</Anchor>
					) : <></>}
					{data?.replying_to ? (
						<>
							<Text display="inline" color="dimmed">{" "}•{" "}</Text>
							<Anchor size="xs" color="dimmed" component={Link} to={"/posts/" + data?.replying_to}>
								Replying to a post
							</Anchor>
						</>
					) : (
							<></>
					)}
				</div>
			</Group>
			<div style={{ paddingLeft: mobileScreen ? 0 : 54, paddingTop: theme.spacing.sm }}>
				<Skeleton visible={!data} height={18} width="100%">
					<Text size="sm">
						{regexifyString({
							pattern: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig,
							decorator: (match, index) => {
								return (
									<>
										<Anchor
											href={match}
											target="_blank"
											onClick={(e: any) => {
												e.preventDefault();
												window.open(match);
											}}
										>
											{match}
										</Anchor>
										{/* <div style={{ borderRadius: theme.radius.md, overflow: "hidden", margin: `${theme.spacing.lg}px 0`, width: mobileScreen ? "100%" : "93%" }}>
											<Embed isDark={theme.colorScheme === "dark"} url={match} />
										</div> */}
									</>
								);
							},
							input: data?.text
						})}
					</Text>
				</Skeleton>
				<Skeleton visible={!data} height={!data ? 18 : 0} width="50%" mt={!data ? 5 : 0} />

				<Group mt="sm" spacing={mobileScreen ? 0 : 100} grow={mobileScreen}>
          <Group spacing={7}>
						<ActionIcon color={liked ? theme.colors.orange[6] : "dark"} size="sm" onClick={(e: any) => { e.preventDefault(); toggleLike() }}>
              {liked ? <IconThumbUpFilled /> : <IconThumbUp />}
            </ActionIcon>
						<Text size="sm" color={liked ? theme.colors.orange[6] : ""}>{likeCount}</Text>
          </Group>

          <Group spacing={7}>
            <ActionIcon color="dark" size="sm">
              <IconMessageCircle2 />
            </ActionIcon>
						<Text size="sm">{commentCount}</Text>
          </Group>

					<ActionIcon color="dark" size="sm" onClick={(e: any) => { e.preventDefault(); copyLink(); } }>
						<IconShare />
					</ActionIcon>
        </Group>
      </div>
    </Paper>
  );
}

export default Post;