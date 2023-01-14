import { CreateCompletionRequest } from "openai";
import { contentAI, extravertedAI } from "../utils/aiPersonality";
import { removeDuplicates } from "../utils/array";
import { openai } from "../utils/openai"
import { stringToTags, tagsToPromptString } from "../utils/tags";
import { BlogCard } from "./blogCardSection";

function generatePrompt({ title, description, tags }: BlogCard) {
  return `# Write an engaging travel blog with reading time of 2 minutes and extract 8 final tags from the site description and the starting tags


## Site description:
Travellers blog

${extravertedAI}

${contentAI}


## starting tags: ${tagsToPromptString(tags)}


## engaging travel blog with reading time of 2 minutes, specify the location in the content:
${title}

${trimUntilLetter(description)}`;
}

function trimUntilLetter(text: string): string {
  // is last letter a letter?
  if (text[text.length - 1].match(/[a-z]/i)) {
    return text;
  }
  return trimUntilLetter(text.slice(0, -1));
}

function request(blogCard: BlogCard): CreateCompletionRequest {
  const prompt = generatePrompt(blogCard);
  // console.log(prompt);
  return {
    model: "text-davinci-003",
    prompt,
    temperature: 0.8,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  };
}

export async function fetchBlogSection(blogCard: BlogCard): Promise<string> {
  const text = await openai.createCompletion(request(blogCard))
    .then(data => data.data.choices[0].text);
  if (!text) {
    // at least return the original blog card in html
    return `
      <h1 class="blog-title">${blogCard.title}</h1>
      <p>${blogCard.description}</p>
      <div class="tags">
        ${blogCard.tags.map(tag => `<span class="tag">#${tag}</span>`).join("\n")}
      </div>
    `;
  }
  // console.log(text);
  // console.log(blogCard);
  const html = text.split("\n").filter(Boolean);
  const tagsLineSplit = html[html.length - 1].split(":");
  const tagsString = tagsLineSplit[tagsLineSplit.length - 1];
  const tags = removeDuplicates([...blogCard.tags, ...stringToTags(tagsString)]);
  const htmlString = html.slice(0, -1).join("</p><p>");
  const section: string = `
    <h1 class="blog-title">${blogCard.title}</h1>
    <p>${trimUntilLetter(blogCard.description)}${htmlString}</p>
    <div class="tags">
      ${tags.map(tag => `<span class="tag">${tag}</span>`).join("\n")}
    </div>
  `;

  return `
    <style>
      ${blogStyle}
    </style>
    <section class="blog">
      ${section}
    </section>
    <section class="blog-cards"></section>
    <script src="/js/fetchBlogCards.js"></script>
    <script>
      // when the page is loaded, fetch the blog cards
      window.addEventListener("load", () => fetchBlogCards(${JSON.stringify(tags)}));
    </script>
  `;
}


const blogStyle = `
  section.blog {
    width: 80vw;
    margin: 5rem 10vw;
  }
  
  h1.blog-title {
    margin: 0;
    font-size: 1.5rem;
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