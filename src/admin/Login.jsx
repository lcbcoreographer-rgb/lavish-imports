import React, { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setEnviando(false);
    if (error) {
      setErro(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : error.message
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-100 px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-card"
      >
        <img src="/assets/lavish-logo.png" alt="Lavish Imports" className="h-8 w-auto" />
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-900">Painel da loja</h1>
        <p className="mt-1 text-sm text-ink-500">Entre para editar o catálogo.</p>

        <label className="mt-6 block text-sm font-semibold text-ink-900">
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-ink-900">
          Senha
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-300/50 px-3 py-2 text-sm font-normal outline-none focus:border-accent-pink"
          />
        </label>

        {erro && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
        )}

        <button type="submit" disabled={enviando} className="btn-primary mt-6 w-full justify-center">
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
