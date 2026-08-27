export function buildWhatsAppUrl(whatsappNumber, lines) {
  const number = String(whatsappNumber || "").replace(/\D/g, "");
  const header = "Hi! I'd like to order:";
  const body = lines
    .map((line) => {
      const sizeTag = line.size ? ` (${line.size})` : "";
      const priceTag = line.price != null
        ? ` — ${Number(line.price).toLocaleString()} ${line.currency}`
        : "";
      return `• ${line.qty}x ${line.name}${sizeTag}${priceTag}`;
    })
    .join("\n");
  const hasPrices = lines.length > 0 && lines.every((line) => line.price != null);
  const oneCurrency = new Set(lines.map((line) => line.currency)).size === 1;
  const total = hasPrices && oneCurrency
    ? `\n\nTotal: ${lines.reduce((sum, line) => sum + Number(line.price) * line.qty, 0).toLocaleString()} ${lines[0].currency}`
    : "";
  const message = `${header}\n\n${body}${total}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
