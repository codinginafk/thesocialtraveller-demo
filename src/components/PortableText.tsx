type PortableTextChild = { text: string };
type PortableTextBlock = {
  _type: string;
  style?: string;
  children?: PortableTextChild[];
};

export default function PortableText({ value }: { value?: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null;
  return (
    <div className="space-y-4 leading-relaxed text-ink">
      {value.map((block, i) => {
        if (block._type !== "block") return null;
        const text = (block.children ?? []).map((c) => c.text).join("");
        switch (block.style) {
          case "h2":
            return (
              <h2 key={i} className="mt-6 text-2xl">
                {text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-4 text-xl">
                {text}
              </h3>
            );
          case "blockquote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-leaf pl-4 italic text-ink-soft"
              >
                {text}
              </blockquote>
            );
          default:
            return <p key={i}>{text}</p>;
        }
      })}
    </div>
  );
}
