export const WHATSAPP_NUMBER = "5541992884208";

function formatBRL(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function buildWhatsappLink(items, totalPrice, hasUndefinedPriceItems) {
  const lines = ["*Pedido pelo site — Lavish Imports*", ""];

  items.forEach((item) => {
    if (typeof item.price === "number") {
      const subtotal = item.price * item.quantity;
      lines.push(`• ${item.quantity}x ${item.name} — ${formatBRL(subtotal)}`);
    } else {
      lines.push(`• ${item.quantity}x ${item.name} — preço a combinar`);
    }
  });

  lines.push("");
  lines.push(
    hasUndefinedPriceItems
      ? `*Total parcial: ${formatBRL(totalPrice)}* (+ itens a combinar)`
      : `*Total: ${formatBRL(totalPrice)}*`
  );

  // Pede de uma vez o que o vendedor sempre precisa perguntar depois.
  lines.push("");
  lines.push("Meu nome: ");
  lines.push("Bairro / como prefiro receber: ");
  lines.push("Forma de pagamento: ");

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function buildWhatsappContactLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
