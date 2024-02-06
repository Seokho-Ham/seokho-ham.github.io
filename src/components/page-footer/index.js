import React from "react";
import "./style.scss";

function PageFooter({ author, githubUrl }) {
  return (
    <footer className="page-footer-wrapper">
      <p className="page-footer">
        © {new Date().getFullYear()}
        &nbsp; 서코코의 개발일지
        {/* &nbsp;Powered By
        <a href="https://github.com/zoomKoding/zoomkoding-gatsby-blog">
          &nbsp;@zoomkoding
        </a> */}
      </p>
    </footer>
  );
}

export default PageFooter;
