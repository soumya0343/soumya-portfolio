import "./BlogSection.css";

const posts = [
  {
    date: "DEC 2024",
    tag: "DESIGN",
    title: "The Art of Negative Space in Digital Interfaces",
    excerpt:
      "Exploring how strategic emptiness creates meaning and guides the viewer's eye through a composition.",
  },
  {
    date: "OCT 2024",
    tag: "TECHNOLOGY",
    title: "Generative Art & the Future of Web Aesthetics",
    excerpt:
      "How algorithmic beauty is reshaping the visual language of the modern internet.",
  },
  {
    date: "AUG 2024",
    tag: "PROCESS",
    title: "Designing with Constraint: A Brutalist Manifesto",
    excerpt:
      "Why imposing limitations on your creative process leads to more honest, impactful work.",
  },
  {
    date: "MAY 2024",
    tag: "CULTURE",
    title: "Typography as Architecture: Building with Letters",
    excerpt:
      "The structural parallels between typeface design and spatial architecture.",
  },
];

const BlogSection = () => {
  return (
    <section className="blog" id="blog">
      <div className="blog__left">
        <span className="blog__number">06</span>
        <h2 className="blog__title" data-reveal="up">
          Blogs
        </h2>
        <p className="blog__subtitle" data-reveal="up" data-reveal-delay="1">
          THOUGHTS & REFLECTIONS
        </p>

        <div className="blog__list">
          {posts.map((post, index) => (
            <article
              className="blog-post"
              key={index}
              data-reveal="up"
              data-reveal-delay={index + 2}
            >
              <div className="blog-post__meta">
                <span className="blog-post__date">{post.date}</span>
                <span className="blog-post__divider">/</span>
                <span className="blog-post__tag">{post.tag}</span>
              </div>
              <h3 className="blog-post__title">{post.title}</h3>
              <p className="blog-post__excerpt">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="blog__right">
        <iframe
          src="/fluid-art.html?palette=plum"
          className="blog__fluid"
          title="Blog Fluid Art"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default BlogSection;
