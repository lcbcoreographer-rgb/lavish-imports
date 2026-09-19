import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { TEXTOS_PADRAO } from "../lib/catalog.js";

const CAMPOS = [
  { key: "hero_selo", label: "Etiqueta acima do título" },
  { key: "hero_titulo", label: "Título (primeira linha)" },
  { key: "hero_titulo_destaque", label: "Título (segunda linha, em rosa)" },
  { key: "hero_subtitulo", label: "Texto abaixo do título", multilinha: true },
  { key: "whatsapp_numero", label: "WhatsApp — número com DDI (só dígitos)" },
  { key: "whatsapp_exibicao", label: "WhatsApp — como aparece escrito" },
  { key: "loja_endereco", label: "Endereço da loja" },
  { key: "loja_horario_semana", label: "Horário — dias de semana" },
  { key: "loja_horario_domingo", label: "Horário — domingo" },
  { key: "instagram_usuario", label: "Instagram (sem @)" },
];

export default function SettingsForm() {
  const [valores, setValores] = useState(TEXTOS_PADRAO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("lavish_settings").select("key, value");
      const atual = { ...TEXTOS_PADRAO };
      (data || []).forEach((l) => {
        if (l.value) atual[l.key] = l.value;
      });
      setValores(atual);
      setCarregando(false);
    })();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setAviso("");

    const numero = valores.whatsapp_numero.replace(/\D/g, "");
    if (numero.length < 12) {
      setSalvando(false);
      setAviso("O número do WhatsApp precisa ter DDI + DDD + número, só dígitos. Ex: 5541992884208");
      return;
    }

    const linhas = CAMPOS.map((c) => ({
      key: c.key,
      value: c.key === "whatsapp_numero" ? numero : valores[c.key],
    }));
    const { error } = await supabase.from("lavish_settings").upsert(linhas);
    setSalvando(false);
    setAviso(error ? error.message : "Textos salvos. O site já mostra a versão nova.");
  }

  if (carregando) return <p className="text-sm text-ink-500">Carregando textos...</p>;

  return (
    <form onSubmit={salvar} className="max-w-2xl rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-display text-xl font-bold text-ink-900">Textos do site</h2>
      <p className="mt-1 text-sm text-ink-500">
        O que aparece no topo da página, no WhatsApp e no rodapé.
      </p>

      <div className="mt-5 grid gap-4">
        {CAMPOS.map((campo) => (
          <label key={campo.key} className="text-sm font-semibold text-ink-900">
            {campo.label}
            {campo.multilinha ? (
              <textarea
                rows={3}
                value={valores[campo.key]}
                onChange={(e) => setValores((v) => ({ ...v, [campo.key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
              />
            ) : (
              <input
                value={valores[campo.key]}
                onChange={(e) => setValores((v) => ({ ...v, [campo.key]: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
              />
            )}
          </label>
        ))}
      </div>

      {aviso && <p className="mt-4 rounded-lg bg-paper-100 px-3 py-2 text-sm text-ink-700">{aviso}</p>}

      <button type="submit" disabled={salvando} className="btn-primary mt-6">
        {salvando ? "Salvando..." : "Salvar textos"}
      </button>
    </form>
  );
}
