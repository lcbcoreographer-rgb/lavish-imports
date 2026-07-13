export const WHATSAPP_NUMBER = "5541987490574";

function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function buildWhatsappLink(items, totalPrice, hasUndefinedPriceItems) {
  const lines = ["Olá! Gostaria de fazer o seguinte pedido:", ""];

  items.forEach((item) => {
    const priceLabel =
      typeof item.price === "number" ? formatBRL(item.price) : "a combinar";
    lines.push(`${item.quantity}x ${item.name} - ${priceLabel}`);
  });

  lines.push("");
  if (hasUndefinedPriceItems) {
    lines.push(`Total estimado: ${formatBRL(totalPrice)} (+ itens com preço a combinar)`);
  } else {
    lines.push(`Total: ${formatBRL(totalPrice)}`);
  }

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function buildWhatsappContactLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
