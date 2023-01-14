import { fetchTitleSectionHTML } from "../completionReq/req-html/titleSection";

export const titleStyle = () => `
  section.title {
    max-width: 80vw;
    margin: 5rem auto;
  }
  
  h1.title {
    font-size: 2rem;
    font-weight: bold;
  }
  
  h2.subtitle {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  p.welcome {
    font-size: 1.25rem;
  }
  
  span.highlight {
    color: maroon
  }
`;

export const renderHeader = `
  <style>
    ${titleStyle()}
  </style>
`

export const renderAsync = async () => `
  <section class="title">
    ${await fetchTitleSectionHTML()}
  </section>
`
