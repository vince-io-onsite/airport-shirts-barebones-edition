import { CreateCompletionRequest } from "openai";
import { contentAI, extravertedAI } from "../utils/aiPersonality";
import { openai } from "../utils/openai";
import { stringToTags, tagsToPromptString } from "../utils/tags";

export interface BlogCard {
  title: string;
  description: string;
  tags: string[];
}

const exampleBlogCards: BlogCard[] = [
  {
    title: "The best city to travel to on a budget",
    description: "Ever wanted to travel but you're on a tight budget? You can go to this amazing city to...",
    tags: ["cities", "budget traveling", "food", "Belgium"],
  },
  {
    title: "Why we love this beach diner",
    description: "Beaches are a dime in a dozen, but this one is very special because it has...",
    tags: ["beach", "diner", "food and drinks", "France"],
  },
  {
    title: "The importance of boots when hiking",
    description: "Don't go on a budget when choosing boots. Quality boots have these...",
    tags: ["nature", "hiking trail", "quality", "USA"],
  },
  {
    title: "Exploring the beauty of nature",
    description: "Nature is full of wonders, and exploring these can be a great way to relax. At this place you can... ",
    tags: ["nature", "relaxing outside", "beauty", "Canada"],
  },
  {
    title: "An unforgettable view of the sunset",
    description: "A sunset has always been beautiful and this one was no different. We had an amazing experience seeing...",
    tags: ["beach", "sunset view", "golden hour", "Mexico"],
  },
];

function blogCardToPromptString(tags?: string[]) {
  return (blogCard: BlogCard) => `${blogCard.title}(${blogCard.description})[${tagsToPromptString(blogCard.tags, tags)}]`;
}

function scrambleBlogCards() {
  return exampleBlogCards.sort(() => Math.random() - 0.5);
}

function scrambledBlogCardsToPromptString(tags?: string[]): string {
  return scrambleBlogCards().map(blogCardToPromptString(tags)).join("\n");
}

function promptStringToBlogCard(promptString: string): BlogCard {
  const trimmedPromptString = promptString.trim();
  let [title, description, tags] = trimmedPromptString.split(/[(\[\]]/).map(str => str.trim());

  // remove closing parentheses in description
  if (description.trim().endsWith(")")) {
    description = description.slice(0, -1).trim();
  }

  return {
    title,
    description,
    tags: stringToTags(tags),
  };
}

const generatePrompt = (tags?: string[]) => `#### Write travel blog post titles and brief description from these tags: ${tagsToPromptString([...tags || [], "cities", "nature", "beach"])}


### Site description:
Travellers blog

${extravertedAI}

${contentAI}


### 10 travel blog post titles and brief description:
${scrambledBlogCardsToPromptString(tags)}
`;

const generateRequest= (tags?: string[]): CreateCompletionRequest => ({
  model: "text-davinci-003",
  prompt: generatePrompt(tags),
  temperature: 0.8,
  max_tokens: 512,
  top_p: 1,
  frequency_penalty: 1,
  presence_penalty: 1,
});

export async function fetchBlogCardsSection(tags?: string[]): Promise<string> {
  let text = await openai.createCompletion(generateRequest(tags)).then(res => res.data.choices[0].text);

  let html: string;
  if (!text) {
    html = scrambleBlogCards().map(blogCardToHTML).join("\n");
  } else {
    html = text.split("\n").map(promptStringToBlogCard).map(blogCardToHTML).join("\n");
  }

  return `
    <style>
      ${blogCardStyle}
    </style>
    <section class="blog-cards">
      ${html}
    </section>
  `;
}

function blogCardToHTML(blogCard: BlogCard): string {
  return `
    <a href="${blogCardToLocalURL(blogCard)}" class="blog-card">
      <span class="card-type">Blog post</span>
      <h3 class="blog-card-title">${blogCard.title}</h3>
      <p class="blog-card-description">${blogCard.description}</p>
      <div class="tags">
        ${blogCard.tags.map(tag => `<span class="tag">${tag}</span>`).join("\n")}
      </div>
    </a>
  `;
}

function blogCardToLocalURL(blogCard: BlogCard): string {
  const title = encodeURI(blogCard.title);
  const description = encodeURI(blogCard.description);
  const tags = encodeURI(blogCard.tags.join(","));

  // console.log(blogCard.tags, tags);

  const params = new URLSearchParams({ title, description, tags });
  return `/blog?${params.toString()}`;
}

const blogCardStyle = `
  section.blog-cards {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  a.blog-card {
    display: flex;
    flex-direction: column;
    width: 80vw;
    padding: 1rem;
    margin: 1rem 10vw;
    border: 1px solid black;
    border-radius: 1rem;
    text-decoration: none;
    color: black;
  }
  
  h3.blog-card-title {
    margin: 0;
    font-size: 1.5rem;
  }
  
  p.blog-card-description {
    margin: 0;
    font-size: 1.25rem;
  }
  
  span.card-type {
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  div.tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  
  span.tag {
    margin: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid black;
    border-radius: 0.5rem;
    font-size: 0.75rem;
  }
`;