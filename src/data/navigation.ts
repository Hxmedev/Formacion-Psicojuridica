// src/data/navigation.ts
export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

export const Navigation: NavItem[] = [
  {
    label: "Formación",
    children: [
      { label: "Conversatorios", href: "/conversatorios" },
      { label: "Cursos", href: "/cursos" },
      { label: "Cap. Equipos", href: "/capacitacion-equipos" },
      { label: "Masterclass / Otros Cont.", href: "/masterclass" },
      { label: "Supervisión", href: "/supervisiones" },
    ],
  },
  { 
    label: "Aula Virtual", 
    href: "https://psiqueducacion.com/",
  },
  { label: "Contacto", href: "/contacto" },
  {
    label: "Institucional / Nosotros",
    children: [
      { label: "Equipo", href: "/equipo" },
      { label: "Historia de la empresa", href: "/historia" },
    ],
  },
];