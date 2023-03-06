import ReactDOM from 'react-dom/client'
import {
	BrowserRouter,
	Routes,
	Route
} from "react-router-dom";

import Layout from "./Layout";
import Home from './routes/Home';
import Login from './routes/Login';
import Signup from './routes/Signup';
import PostPage from "./routes/PostPage";
import UserPage from "./routes/UserPage";
import ChatPage from "./routes/ChatPage";
import Hero from './routes/Hero';
import ChatView from './components/ChatView';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Hero />} />
				<Route path="home" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="signup" element={<Signup />} />

				<Route path="chat" element={<ChatPage />}>
					<Route path=":chatId" element={<ChatView />} />
				</Route>

				<Route path="posts">
					<Route path=":postId" element={<PostPage />} />
				</Route>

				<Route path="users">
					<Route path=":userId" element={<UserPage />} />
				</Route>
			</Route>
		</Routes>
	</BrowserRouter>
)
