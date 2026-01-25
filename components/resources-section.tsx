"use client";

interface ResourcesSectionProps {
  resources: {
    [key: string]: string[];
  };
}

const extractUrl = (text: string) => {
  const match = text?.match(/https?:\/\/\S+/);
  return match ? match[0] : "";
};

export default function ResourcesSection({ resources }: ResourcesSectionProps) {
  const renderCategory = (category: string, items: string[]) => {
    const linkCategory = `${category}-link`;
    const links = resources?.[linkCategory] || [];

    return (
      <div
        key={category}
        className="bg-card border border-border rounded-lg p-6 hover:border-secondary transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-300 mb-4">{category}</h3>

        <ul className="space-y-3">
          {items.map((item, idx) => {
            const url = extractUrl(links[idx] || "");

            return (
              <li
                key={idx}
                className="flex items-start gap-3 text-gray-300 hover:text-foreground transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0 mt-1.5"></span>

                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm leading-relaxed underline hover:text-blue-400"
                  >
                    {item}
                  </a>
                ) : (
                  <span className="text-sm leading-relaxed">{item}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-12 mb-12">
      <h2 className="text-3xl font-bold mb-8">Learning Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(resources)
          .filter(([category]) => !category.endsWith("-link")) // ✅ hide link arrays
          .map(([category, items]) => renderCategory(category, items))}
      </div>
    </div>
  );
}
