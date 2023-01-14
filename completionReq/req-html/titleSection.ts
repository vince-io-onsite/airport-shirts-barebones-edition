import { CreateCompletionRequest } from "openai";
import { titleStyle } from "../../frontend/TitleSection";
import { openai } from "../../utils/openai";

console.log(titleStyle())

const prompt = `#### Write an engaging title, subtitle and welcome message with some text highlighted in styled HTML from the site description:


### Site description:
Airport Shirts 
Elevate your travel wardrobe with AI-designed t-shirts
This is an AI-powered clothing webshop that offers a unique selection of t-shirts designed by AI, inspired by cities, nature and the beach. You can browse and purchase these t-shirts online. We are currently focusing on the core functionality of the webshop, but we are working on adding more features to enhance the customer experience. We would love for you to come back and check the progress soon.
- AI-designed t-shirts (coming soon)
- Core functionality of the webshop
- Designs inspired by cities, nature and the beach
- Browse and purchase t-shirts online
- Core functionality of the webshop
- More AI features to enhance the customer experience


### an engaging title, subtitle and welcome message with some text highlighted in styled HTML:
<style>
${titleStyle()}
</style>
<section class="title">`;

const request: CreateCompletionRequest = {
  model: "text-davinci-003",
  prompt,
  temperature: 1,
  max_tokens: 512,
  top_p: 1,
  frequency_penalty: 1,
  presence_penalty: 1,
  stop: ["</section>"],
};

const defaultHtml = `
  <section class="title">
    <h1 class="title">Airport Shirts</h1>
    <h2 class="subtitle">Elevate your travel wardrobe with AI-designed t-shirts</h2>
    <p class="welcome">This is an AI-powered clothing webshop that offers a unique selection of t-shirts designed by AI, inspired by cities, nature and the beach. You can browse and purchase these t-shirts online. We are currently focusing on the core functionality of the webshop, but we are working on adding more features to enhance the customer experience. We would love for you to come back and check the progress soon.</p>
  </section>
`

export async function fetchTitleSectionHTML() {
  let html = await openai.createCompletion(request)
    .then(data => data.data.choices[0].text);

  return html || defaultHtml;
}
