import {
  DOMParser,
  Element,
  Node,
} from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";

export function htmlToMarkdown(html: string, selector?: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  if (!document) throw new Error("Failed to parse HTML");

  function processNode(node: Node): string {
    if (node.nodeType === node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType !== node.ELEMENT_NODE) {
      return "";
    }

    const element = node as Element;

    // Process children first
    const childContent = Array.from(node.childNodes)
      .map((child) => processNode(child))
      .join("");

    switch (element.tagName.toLowerCase()) {
      case "h1":
        return `# ${childContent}\n`;
      case "h2":
        return `## ${childContent}\n`;
      case "h3":
        return `### ${childContent}\n`;
      case "p":
        return `${childContent}\n`;
      case "strong":
      case "b":
        return `**${childContent}**`;
      case "em":
      case "i":
        return `*${childContent}*`;
      case "a":
        return `[${childContent}](${element.getAttribute("href")})`;
      case "ul":
        return childContent + "\n";
      case "ol":
        return childContent + "\n";
      case "li":
        if (element.parentElement?.tagName.toLowerCase() === "ol") {
          const index =
            Array.from(element.parentElement.children).indexOf(element) + 1;
          return `${index}. ${childContent}`;
        }
        return `* ${childContent}`;
      case "code":
        if (element.parentElement?.tagName.toLowerCase() === "pre") {
          return childContent;
        }
        return `\`${childContent}\``;
      case "pre":
        return `\`\`\`\n${childContent}\`\`\`\n`;
      case "br":
        return "\n";
      case "img":
        return `![${element.getAttribute("alt") || ""}](${
          element.getAttribute("src") || ""
        })`;
      default:
        return childContent;
    }
  }

  // If a selector is provided, only process those elements
  if (selector) {
    const selectedElements = document.querySelectorAll(selector);
    if (selectedElements.length === 0) {
      throw new Error(`No elements found matching selector: ${selector}`);
    }
    return Array.from(selectedElements)
      .map((element) => processNode(element))
      .join("\n\n")
      .trim();
  }

  return processNode(document.body).trim();
}
