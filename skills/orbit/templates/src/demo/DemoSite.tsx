// Escolhe o site de exemplo do ramo. Cada um tem tema, tipografia e seções próprias.
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Padaria } from "./sites/Padaria";
import { Salao } from "./sites/Salao";
import { Barbearia } from "./sites/Barbearia";
import { Loja } from "./sites/Loja";
import { LavaRapido } from "./sites/LavaRapido";
import { Clinica } from "./sites/Clinica";
import { Advocacia } from "./sites/Advocacia";
import type { SiteProps } from "./sites/shared";

const SITES: Record<string, (p: SiteProps) => ReactElement> = {
  padaria: Padaria,
  salao: Salao,
  barbearia: Barbearia,
  loja: Loja,
  "lava-rapido": LavaRapido,
  clinica: Clinica,
  advocacia: Advocacia,
};

/**
 * `topo`: monta só o começo do site (faixa, menu e a primeira seção). Serve para as miniaturas da
 * vitrine, que só mostram a primeira tela: o celular desenha muito menos.
 * Os sites não têm estado próprio, então dá para gerar o elemento e cortar os filhos com segurança.
 */
export function DemoSite({
  ramo,
  nome,
  mobile = false,
  eager = false,
  topo = false,
}: {
  ramo: string;
  nome: string;
  mobile?: boolean;
  eager?: boolean;
  topo?: boolean;
}) {
  const Site = SITES[ramo] ?? Padaria;
  if (!topo) return <Site nome={nome} mobile={mobile} eager={eager} />;

  const raiz = Site({ nome, mobile, eager }) as ReactElement<{ children?: ReactNode }>;
  const filhos = Children.toArray(raiz.props.children);
  const fim = filhos.findIndex((c) => isValidElement(c) && c.type === "section");
  return cloneElement(raiz, undefined, ...(fim >= 0 ? filhos.slice(0, fim + 1) : filhos));
}
