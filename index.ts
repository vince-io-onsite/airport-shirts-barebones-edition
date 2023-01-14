import express from "express";
import { createServer } from "http";
import { fetchBlogCardsSection } from "./completionReq/blogCardSection";
import { fetchBlogSection } from "./completionReq/blogSection";
import { renderHeader } from "./frontend/TitleSection";
import { wrapLayout } from "./utils/wrapLayout";

import * as TitleSection from "./frontend/TitleSection";

const app = express();
const server = createServer(app);

app.use(express.static("public"));
app.use(express.json());

app.get("/", async (req, res) => {
  console.log("Requesting completion...");
  console.time("completion: /");
  const [titleSection, blogCardsSection] = await Promise.all([
    TitleSection.renderAsync(),
    fetchBlogCardsSection(),
  ]);
  console.timeEnd("completion: /");
  // console.log([titleSection, blogCardsSection]);

  res.send(wrapLayout([titleSection, blogCardsSection], [renderHeader]));
});

app.get("/blog", async (req, res) => {
  const { title: encodedTitle, description: encodedDescription, tags: encodedTags } = req.query;
  console.log(decodeURI(encodedTags as string));
  const { title, description, tags } = {
    title: decodeURI(encodedTitle as string),
    description: decodeURI(encodedDescription as string),
    tags: decodeURI(encodedTags as string).split(","),
  }

  console.log("Requesting completion...");
  console.time("completion: /blog");
  const blogSection = await fetchBlogSection({ title, description, tags });
  console.timeEnd("completion: /blog");

  res.send(wrapLayout([blogSection]));
});

app.post("/api/blog/cards", async (req, res) => {
  const { tags } = req.body;
  console.log("Requesting completion...");
  console.time("completion: /api/blog/cards");
  const blogCardsSection = await fetchBlogCardsSection(tags);
  console.timeEnd("completion: /api/blog/cards");

  res.json({ html: blogCardsSection });
});

server.listen(3000, () => {
  console.log("Server started on port 3000");
});