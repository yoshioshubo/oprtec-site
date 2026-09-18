"use client";

import { useEffect, useRef, useState } from "react";
import { formatarNumero, separarNumero } from "@/lib/contador";

const DURACAO_MS = 1800;

// Número que sobe de 0 até o valor final quando entra na tela (uma vez só).
// O HTML do servidor já traz o valor final — é o que o Google, quem está sem JavaScript
// e quem pediu "reduzir movimento" no sistema veem. Leitores de tela leem sempre o valor
// final (sr-only); o texto que muda fica aria-hidden para não ser anunciado a cada quadro.
export default function ContadorAnimado({ valor }) {
  const ref = useRef(null);
  const [atual, setAtual] = useState(null); // null = mostra o texto final

  useEffect(() => {
    const partes = separarNumero(valor);
    if (!partes || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro;
    const pintar = (n) => setAtual(partes.prefixo + formatarNumero(n, partes) + partes.sufixo);
    pintar(0);

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        const inicio = performance.now();
        const passo = (agora) => {
          const p = Math.min((agora - inicio) / DURACAO_MS, 1);
          pintar(partes.alvo * (1 - Math.pow(1 - p, 3))); // desacelera no fim
          if (p < 1) quadro = requestAnimationFrame(passo);
          else setAtual(null);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );
    observador.observe(ref.current);

    return () => {
      observador.disconnect();
      cancelAnimationFrame(quadro);
    };
  }, [valor]);

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {atual ?? valor}
      </span>
      <span className="sr-only">{valor}</span>
    </span>
  );
}
