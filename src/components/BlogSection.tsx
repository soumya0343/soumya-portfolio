import "./BlogSection.css";

const BlogSection = () => {
  return (
    <section className="blog" id="blog">
      <div className="blog__left">
        <span className="blog__number">07</span>
        <h2 className="blog__title" data-reveal="up">
          Blogs
        </h2>
        <p className="blog__subtitle" data-reveal="up" data-reveal-delay="1">
          THOUGHTS & REFLECTIONS
        </p>

        <div className="blog__list">
          <div
            className="blog__coming-soon"
            data-reveal="up"
            data-reveal-delay="2"
          >
            <h3 className="blog-post__title">Writing in Progress...</h3>
            <p className="blog-post__excerpt">
              I am currently drafting articles about Backend Architecture,
              Frontend Optimization, and AI integrations. Check back soon for
              deep dives into my engineering process.
            </p>
            <div className="blog__topics">
              <span className="blog-post__tag">ENGINEERING</span>
              <span className="blog-post__tag">DESIGN</span>
              <span className="blog-post__tag">TECHNOLOGY</span>
            </div>
          </div>
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
