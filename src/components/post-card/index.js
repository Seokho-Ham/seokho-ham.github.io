import { Link } from "gatsby";
import React from "react";
import "./style.scss";

function PostCard({ post }) {
  const { id, slug, title, excerpt, date, categories } = post;
  return (
    <div className="post-card-wrapper">
      <Link className="post-card" key={id} to={slug}>
        <div className="info">
          <div className="date">{date}</div>
          <div className="categories">
            {categories.map((category) => (
              <div className="category" key={category}>
                {category}
              </div>
            ))}
          </div>
        </div>
        <div className="title">{title}</div>
        <p
          className="description"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      </Link>
    </div>
  );
}

export default PostCard;
