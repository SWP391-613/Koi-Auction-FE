import { faker } from "@faker-js/faker";

export const generateBlogPostsPreview = (count: number) => {
  const blogPosts = [];
  for (let i = 1; i <= count; i++) {
    blogPosts.push({
      id: i,
      title: `Blog Post ${i}`,
      image: "/breeders-transparent.png",
      excerpt: `Excerpt for Blog Post ${i}...`,
    });
  }
  return blogPosts;
};

export const generateBlogPosts = (count: number) => {
  const blogPosts = [];
  for (let i = 1; i <= count; i++) {
    blogPosts.push({
      id: i,
      title: `Blog Post ${i}`,
      image: "/breeders-transparent.png",
      content: `${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()} ${faker.word.noun()} ${faker.word.verb()} ${faker.word.adjective()}`,
    });
  }
  return blogPosts;
};
