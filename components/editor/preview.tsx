import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote-client/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export function Preview({ content }: { content: string }) {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className="markdown prose grid wrap-break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              className="shadow-light-200 dark:shadow-dark-200"
              lineNumbers
            />
          ),
        }}
      />
    </section>
  );
}
