import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
	BrowserRouter,
	Routes,
	Route
} from "react-router-dom";

import Layout from "./Layout";
import Home from './routes/Home';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<Home />} />
			</Route>
		</Routes>
	</BrowserRouter>
)
