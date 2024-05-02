import { Container } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "News Feed" },
    { name: "description", content: "Welcome to Personal news feed platform!" },
  ];
};

export default function Index() {
  return (
    <Container>
      <h1>News Feed</h1>
    </Container>
  );
}
