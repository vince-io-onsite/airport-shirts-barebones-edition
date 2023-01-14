function fetchBlogCards(tags) {
  fetch("/api/blog/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({tags}),
  }).then(res => res.json()).then(data => {
    const blogSection = document.querySelector(".blog-cards");
    if (blogSection) {
      blogSection.innerHTML = data.html;
    }
  });
}