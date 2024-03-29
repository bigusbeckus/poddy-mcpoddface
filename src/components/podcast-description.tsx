import { useEffect, useRef } from "react";

type PodcastDescriptionProps = {
  description: string | null | undefined;
  className?: string;
};

export const PodcastDescription: React.FC<PodcastDescriptionProps> = ({
  description,
  className,
}) => {
  const descriptionNode = useRef<HTMLParagraphElement>(null);
  const content = description ? description : "";

  useEffect(() => {
    const element = document.createElement("span");
    element.innerHTML = content;
    try {
      const toRemove = element.querySelectorAll("hr, img");
      toRemove.forEach((el) => element.removeChild(el));
    } catch {}
    const children = element.querySelectorAll("*");
    children.forEach((el) => el.removeAttribute("style"));
    descriptionNode.current?.replaceChildren(element);
  }, [content]);

  return <p ref={descriptionNode} className={className} />;
};
