import { Loader } from "@mantine/core";

function Loading () {
	return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Loader size="sm" />
    </div>
  );
}

export default Loading;