export function resolveImageSource(value) {
  const source = String(value || "").trim();
  if (!source) return "";

  if (/^(?:https?:)?\/\//i.test(source) || /^(?:data|blob):/i.test(source)) {
    return source;
  }

  if (source.startsWith("/")) return source;
  if (source.toLowerCase().startsWith("public/")) return `/${source.slice(7)}`;
  if (source.toLowerCase().startsWith("assets/")) return `/${source}`;

  return `/assets/images/${source}`;
}
