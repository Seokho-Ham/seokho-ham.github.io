import React, { createRef, useEffect, useRef } from "react";
import Giscus from "@giscus/react";

const src = "https://utteranc.es/client.js";
const branch = "master";

function Comment({ repo, path }) {
  const rootElm = createRef();
  const isUtterancesLoaded = useRef(false);
  let storedIsDarkMode = false;
  useEffect(() => {
    if (!rootElm.current || isUtterancesLoaded.current) return;
    storedIsDarkMode = localStorage.getItem("isDarkMode");
    isUtterancesLoaded.current = true;
  }, [rootElm, path]);
  // return <div className="utterances" ref={rootElm} />;

  return (
    <Giscus
      id="comments"
      repo="seokho-ham/seokho-ham.github.io"
      repoId="MDEwOlJlcG9zaXRvcnkzNTk1MDExNjk="
      category="General"
      categoryId="DIC_kwDOFW2Ncc4Cc-vS"
      mapping="title"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme={JSON.parse(storedIsDarkMode) ? "dark" : "light"}
      lang="en"
    />
  );
}

export default Comment;
