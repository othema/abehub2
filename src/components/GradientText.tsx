import { DefaultMantineColor, useMantineTheme } from "@mantine/core";
import { ReactNode } from "react";

export interface IGradientTextProps {
	start: DefaultMantineColor;
	end: DefaultMantineColor;
	deg?: number;
	children: ReactNode;
}

function GradientText({ start, end, children, deg = 45 }: IGradientTextProps) {
	const theme = useMantineTheme();
	return (
		<span
			style={{
				background: theme.fn.linearGradient(deg, start, end),
				backgroundClip: "text",
				color: "transparent",
			}}
		>
			{children}
		</span>
	);
}

export default GradientText;