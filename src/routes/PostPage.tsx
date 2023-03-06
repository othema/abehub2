import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";
import { pb } from "../lib/pocketbase";
import { Container, Divider } from "@mantine/core";
import WriteComment from "../components/WriteComment";

function PostPage() {
	const navigate = useNavigate();
	const { postId } = useParams();

	const [post, setPost] = useState<any>(null);

	useEffect(() => {
		getPost();
	}, [postId]);

	async function getPost() {
		if (!postId) return;
    setPost(await pb.collection("posts").getOne(postId, { expand: "user,likes(post),posts(replying_to).user,posts(replying_to).likes(post),posts(replying_to).posts(replying_to)", $autoCancel: false }));
	}

	if (!postId) {
		navigate("/home", { replace: true })
		return <></>;
	}

	return (
    <Container size="xs" p={0}>
      <Post data={post} withBorder margin={false} deleteCallback={() => navigate("/home")} />

      <Divider my="lg" />

			<WriteComment replying={postId} callback={getPost} />

      {post ? post?.expand["posts(replying_to)"]?.map((comment: any) => <Post data={comment} deleteCallback={() => getPost()} />) : <></>}
    </Container>
  );
}

export default PostPage;