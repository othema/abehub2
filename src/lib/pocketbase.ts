import PocketBase, { ClientResponseError } from "pocketbase";

export const PB_URL = "https://abehub.pockethost.io";
export const pb = new PocketBase(PB_URL);


export async function login(
  identity: string,
  password: string
): Promise<ClientResponseError | void> {
	try {
		await pb.collection("users").authWithPassword(identity, password);
		window.location.replace("/home");  // On successful login, go to home page

	} catch (err: any) {
		throw err;
  }
}

export async function signUp(
  username: string,
  password: string,
  passwordConfirm: string,
  email: string,
  fullName: string
): Promise<ClientResponseError | void> {
  const data = {
    username,
    password,
    email: email,
    passwordConfirm: passwordConfirm,
    name: fullName,
  };
	try {
		await pb.collection("users").create(data);
		return await login(username, password);
	} catch (err: any) {
		throw err;
	}
}

export function logOut() {
  pb.authStore.clear();
  window.location.replace("/login");
}

export function avatarUrl(user: any, small = true): string | null {
	if (!user) return null;
	if (!user.avatar) return null;
	return `${PB_URL}/api/files/users/${user.id}/${user.avatar}${small ? "?thumb=50x50" : ""}`;
}

export function getChatName(chatData: any) {
	const members = chatData?.expand?.members;
	const isGroup = members?.length > 2;
	const otherUser = !isGroup ? (members?.[0].id == pb.authStore.model?.id ? members?.[1] : members?.[0]) : null;
	return isGroup ? `${members?.[0].name.split(" ")[0]}, ${members?.[1].name.split(" ")[0]} +${members?.length - 2}` : otherUser?.name.split()[0];
}