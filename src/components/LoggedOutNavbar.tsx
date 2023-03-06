import { Group, Header, Text, Anchor, Button } from "@mantine/core";
import { Link } from "react-router-dom";

import Logo from "./Logo";

function LoggedOutNavbar() {
  return (
    <Header
      height={60}
    >
      <div
        style={{
          width: "100%",
          paddingLeft: 30,
          paddingRight: 30,
          height: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1550,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Group>
          <Anchor to="/" component={Link} underline={false}>
            <Logo />
          </Anchor>
				</Group>
				
				<Group>
					<Button to="/login" color="dimmed" component={Link} variant="light">Login</Button>
					<Anchor to="/signup" color="dimmed" component={Link}>Signup</Anchor>
				</Group>
      </div>
    </Header>
  );
}

export default LoggedOutNavbar;