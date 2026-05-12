'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/* ────────────────────────────────────────────────────────────────────────
 * Field Machine — Prototype v2
 * Marketplace P2P de serviços agrícolas. Dark editorial, Apple typography,
 * Uber motion, Nubank energy, Dell structure.
 * ──────────────────────────────────────────────────────────────────────── */

const APP_SIGNUP = 'https://app.fieldmachine.com.br/cadastro';
const APP_LOGIN = 'https://app.fieldmachine.com.br/login';

const KINETIC_WORDS = ['movimento.', 'produção.', 'safra.', 'rede.'];

const NAV_LINKS = [
  { label: 'Máquinas', href: '#maquinas' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Atividade', href: '#atividade' },
  { label: 'FAQ', href: '#faq' },
];

const STATS = [
  { value: 91, suffix: '', label: 'Máquinas ativas', delta: 'Cadastro verificado' },
  { value: 389, suffix: '', label: 'Produtores na rede', delta: 'Em 8 estados' },
  { value: 96, suffix: '%', label: 'Conexões bem avaliadas', delta: 'Últimos 90 dias' },
  { value: 14, suffix: '', label: 'Regiões atendidas', delta: 'Sul · Centro-Oeste · MATOPIBA' },
];

const CITIES = [
  'Cascavel · PR',
  'Londrina · PR',
  'Maringá · PR',
  'Sorriso · MT',
  'Sinop · MT',
  'Rondonópolis · MT',
  'Cristalina · GO',
  'Luís Eduardo Magalhães · BA',
  'Rio Verde · GO',
  'Dourados · MS',
  'Não-Me-Toque · RS',
  'Passo Fundo · RS',
  'Uberaba · MG',
  'Patos de Minas · MG',
  'Balsas · MA',
];

const MACHINES = [
  {
    name: 'Tratores',
    desc: 'Do 75 cv para implementos ao 4x4 de alta potência.',
    img: '/images/tractor.jpg',
    span: 'lg' as const,
  },
  {
    name: 'Colheitadeiras',
    desc: 'Soja, milho, trigo, sorgo. Janela apertada, resposta rápida.',
    img: '/images/combine.jpg',
    span: 'sm' as const,
  },
  {
    name: 'Pulverizadores',
    desc: 'Autopropelidos e de arrasto, bicos calibrados.',
    img: '/images/sprayer.jpg',
    span: 'sm' as const,
  },
  {
    name: 'Plantadeiras',
    desc: 'Plantio direto e convencional, de 7 a 38 linhas.',
    img: '/images/planter.jpg',
    span: 'sm' as const,
  },
];

const STEPS = [
  { n: '01', title: 'Busque', desc: 'Filtre por máquina, modelo, raio de distância e janela de data.' },
  { n: '02', title: 'Conecte', desc: 'Mande mensagem no chat. Resposta do proprietário, não de call center.' },
  { n: '03', title: 'Combine', desc: 'Valor, forma de pagamento e logística vocês acertam. PIX, boleto ou na unha.' },
  { n: '04', title: 'Avalie', desc: 'Quatro notas por contrato: máquina, operador, serviço e cliente.' },
];

const PRODUTOR_BULLETS = [
  { title: 'Encontre', desc: 'Máquinas a poucos quilômetros, com disponibilidade real.' },
  { title: 'Negocie', desc: 'Chat direto, sem cotação por telefone que ninguém responde.' },
  { title: 'Pague direto', desc: 'O valor combinado é o valor pago. Sem taxa por cima.' },
  { title: 'Avalie', desc: 'Sua nota ajuda o próximo produtor a escolher melhor.' },
];

const PRESTADOR_BULLETS = [
  { title: 'Cadastre', desc: 'Anuncie suas máquinas em minutos. De graça, sempre.' },
  { title: 'Receba demanda', desc: 'Produtores da sua região acham você primeiro.' },
  { title: 'Rentabilize', desc: 'Trator parado em galpão não paga financiamento.' },
  { title: 'Construa fama', desc: 'Boa avaliação puxa o próximo serviço. E o seguinte.' },
];

const DIFFERENTIATORS = [
  { kicker: '0%', title: 'Zero taxa', desc: 'Combinou R$ 1.000? Você recebe R$ 1.000. Ponto.' },
  { kicker: '<30min', title: 'Resposta rápida', desc: 'A maioria das mensagens é respondida em menos de meia hora.' },
  { kicker: 'BR', title: 'Segurança real', desc: 'Perfil verificado, histórico público e chat com registro.' },
  { kicker: 'KM', title: 'Proximidade', desc: 'Filtro por raio. Diesel é caro, deslocamento longo, pior ainda.' },
  { kicker: '/', title: 'Negociação livre', desc: 'Preço, prazo e condições vocês definem. Sem tabela imposta.' },
  { kicker: '4D', title: 'Reputação que conta', desc: 'Quatro notas por serviço: máquina, operador, atendimento e cliente.' },
];

const ACTIVITY_POOL = [
  { text: 'Trator John Deere 7M alugado por R$ 480/dia', city: 'Cascavel · PR', minutes: 4 },
  { text: 'Colheitadeira Case 8250 contratada para 120 ha', city: 'Sorriso · MT', minutes: 11 },
  { text: 'Pulverizador autopropelido Jacto Uniport reservado', city: 'Luís Eduardo Magalhães · BA', minutes: 18 },
  { text: 'Operador com 12 anos de experiência fechou serviço', city: 'Maringá · PR', minutes: 27 },
  { text: 'Plantadeira Stara Estrela 32 linhas alugada por R$ 2.100/dia', city: 'Cristalina · GO', minutes: 42 },
  { text: 'Trator Valtra A750 contratado em emergência', city: 'Sinop · MT', minutes: 58 },
  { text: 'Colheitadeira New Holland CR6.80 reservada', city: 'Londrina · PR', minutes: 73 },
  { text: 'Distribuidor de calcário Stara Hércules alugado', city: 'Rondonópolis · MT', minutes: 91 },
  { text: 'Trator Massey Ferguson 7180 contratado para preparo', city: 'Rio Verde · GO', minutes: 104 },
  { text: 'Operador autônomo com nota 4.9 fechou semana cheia', city: 'Dourados · MS', minutes: 122 },
];

const TESTIMONIALS = [
  {
    name: 'João Vicente',
    city: 'Cascavel · PR',
    text:
      'Minha colheitadeira quebrou no meio da safra. Achei outra a 18 km, fechei no chat em 40 minutos e colhi tudo no prazo. Não perdi um saco.',
  },
  {
    name: 'Marta Hoffmann',
    city: 'Sorriso · MT',
    text:
      'Meu trator ficava três meses parado depois do plantio. Em duas safras na plataforma, ele pagou metade da parcela do financiamento.',
  },
  {
    name: 'Pedro Tavares',
    city: 'Luís Eduardo Magalhães · BA',
    text:
      'Falei direto com o operador, combinei tudo por PIX, ele veio no dia marcado. Sem agência, sem comissão, sem aquela enrolação.',
  },
];

/* FAQ ── O TEXTO AQUI É BYTE-IDENTICAL AO JSON-LD EM layout.tsx.
 * Não alterar sem atualizar o jsonLd → quebra a paridade SEO. */
const FAQS = [
  {
    question: 'Como funciona o pagamento?',
    answer:
      'O pagamento é combinado diretamente entre você e o proprietário/operador. A plataforma facilita a conexão e a negociação — vocês decidem a forma de pagamento (PIX, dinheiro, transferência, etc.).',
  },
  {
    question: 'A plataforma cobra alguma taxa?',
    answer:
      'Não! O FieldMachine é gratuito para uso. Não cobramos comissão sobre os serviços contratados. Nosso objetivo é conectar a comunidade agrícola.',
  },
  {
    question: 'Como garantir que o serviço será bem feito?',
    answer:
      'Nosso sistema de avaliações permite que tanto o contratante quanto o prestador avaliem a experiência. São avaliados: qualidade do serviço, operador, máquina e o próprio cliente.',
  },
  {
    question: 'Como posso me tornar um prestador de serviço?',
    answer:
      'Cadastre-se na plataforma, complete seu perfil e cadastre suas máquinas. Produtores da sua região poderão encontrar e contratar seus serviços automaticamente.',
  },
];

/* ───────────────────────── Inline icons ───────────────────────── */
type IconName =
  | 'arrow'
  | 'check'
  | 'tractor'
  | 'leaf'
  | 'pin'
  | 'bolt'
  | 'shield'
  | 'chat'
  | 'star'
  | 'real';

function Icon({ name, className }: { name: IconName; className?: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  };
  switch (name) {
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
      );
    case 'tractor':
      return (
        <svg {...common}>
          <path d="M3 17h6m6 0h2a2 2 0 0 0 2-2v-3l-2-5h-7v6" />
          <circle cx="6" cy="17" r="3" />
          <circle cx="17" cy="17" r="3" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...common}>
          <path d="M20 4S9 3 5 9c-3 4 0 11 0 11s7 3 11 0c6-4 4-16 4-16z" />
          <path d="M11 13l-6 6" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'chat':
      return (
        <svg {...common}>
          <path d="M21 12a8 8 0 0 1-11 7.4L4 21l1.6-6A8 8 0 1 1 21 12z" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 2l3.1 6.4 7 1-5.1 5 1.3 7-6.3-3.3L5.7 21.4 7 14.4l-5-5 7-1L12 2z" />
        </svg>
      );
    case 'real':
      return (
        <svg {...common}>
          <path d="M8 6h6a3 3 0 1 1 0 6H8m0 0v6m0-6h6l3 6" />
        </svg>
      );
  }
}

/* ───────────────────────── Hooks ───────────────────────── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.setAttribute('data-reveal', 'true');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return ref;
}

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(2, -10 * p);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (reduced) {
          setValue(target);
        } else {
          raf = requestAnimationFrame(tick);
        }
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target, durationMs]);
  return { value, ref };
}

/* ───────────────────────── Primitives ───────────────────────── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-eyebrow">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  as: As = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'span' | 'li' | 'h2';
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <As
      // @ts-expect-error generic ref delegation
      ref={ref}
      data-reveal="false"
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
      className={className}
    >
      {children}
    </As>
  );
}

/* ───────────────────────── Sections ───────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header
      data-scrolled={scrolled}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-3' : 'py-5'
      }`}
    >
      <nav className="mx-auto max-w-[1280px] px-6 md:px-10 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl md:text-[28px] leading-none tracking-[-0.03em] text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
            field<span className="italic">machine</span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-[0.875rem] text-[var(--color-text-muted)]">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="hover:text-[var(--color-text)] transition-colors duration-200"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={APP_LOGIN}
            className="text-[0.875rem] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Entrar
          </a>
          <a href={APP_SIGNUP} className="btn-primary !py-2.5 !px-5 !text-[0.875rem]">
            Criar conta
            <Icon name="arrow" className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
          className="md:hidden w-10 h-10 rounded-full border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-text)]"
        >
          <span className="sr-only">Menu</span>
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="md:hidden absolute top-full inset-x-0 glass border-t border-[var(--color-hairline)] px-6 py-8">
          <ul className="flex flex-col gap-5 text-lg">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="text-[var(--color-text)]">
                  {l.label}
                </a>
              </li>
            ))}
            <li className="flex gap-3 pt-4">
              <a href={APP_LOGIN} className="btn-ghost flex-1 !py-3">
                Entrar
              </a>
              <a href={APP_SIGNUP} className="btn-primary flex-1 !py-3">
                Criar conta
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
      {/* Background image — heavy treatment */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover opacity-40"
          style={{ objectPosition: '60% 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/70 via-[var(--color-bg)]/85 to-[var(--color-bg)]" />
        <div className="absolute inset-0 hero-mesh" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10 grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 lg:col-span-10">
          <Reveal>
            <Eyebrow>Marketplace agrícola peer-to-peer · Brasil</Eyebrow>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="mt-8 text-display">
              <span className="block">O campo</span>
              <span className="block">
                em{' '}
                <span className="kinetic align-baseline" aria-label="movimento">
                  <span className="kinetic-track">
                    {KINETIC_WORDS.map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                    <span aria-hidden>{KINETIC_WORDS[0]}</span>
                  </span>
                </span>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <p className="mt-10 max-w-[44ch] text-lead">
              Encontre tratores, colheitadeiras e operadores na sua região e combine direto com quem
              opera. Sem comissão, sem intermediário, sem enrolação.
            </p>
          </Reveal>

          <Reveal delay={380}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href={APP_SIGNUP} className="btn-primary">
                Encontrar máquina
                <Icon name="arrow" className="w-4 h-4" />
              </a>
              <a href="#como-funciona" className="btn-ghost">
                Sou prestador
              </a>
            </div>
          </Reveal>

          <Reveal delay={500}>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[var(--color-text-muted)]">
              {['Zero comissão', 'Pagamento direto no PIX', 'Avaliações em 4 dimensões'].map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Icon name="check" className="w-4 h-4 text-[var(--color-accent)]" />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
        <span>scroll</span>
        <span className="block w-px h-8 bg-gradient-to-b from-[var(--color-text-muted)] to-transparent" />
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section id="pulso" className="relative border-y border-[var(--color-hairline)] bg-[var(--color-surface)]/40">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-hairline)]">
          {STATS.map((s, i) => (
            <StatCell key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { value, ref } = useCountUp(stat.value);
  return (
    <div className="py-10 lg:py-14 px-2 lg:px-8 first:pl-0 last:pr-0">
      <div className="text-eyebrow mb-4 flex items-center gap-2">
        <span className="font-mono text-[var(--color-accent)]">0{index + 1}</span>
        <span>{stat.label}</span>
      </div>
      <div className="text-stat">
        <span ref={ref}>{value}</span>
        {stat.suffix}
      </div>
      <div className="mt-3 text-sm text-[var(--color-text-muted)]">{stat.delta}</div>
    </div>
  );
}

function CityMarquee() {
  const items = [...CITIES, ...CITIES];
  return (
    <section aria-label="Cidades atendidas" className="marquee py-8 border-b border-[var(--color-hairline)]">
      <div className="marquee-track text-[var(--color-text-muted)] text-sm tracking-[0.12em] uppercase">
        {items.map((c, i) => (
          <span key={`${c}-${i}`} className="inline-flex items-center gap-3 font-mono">
            <span className="inline-block w-1 h-1 rounded-full bg-[var(--color-accent)]/70" />
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}

function CatalogBento() {
  return (
    <section id="maquinas" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal>
          <Eyebrow>01 — Catálogo</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-6 text-h1 max-w-[14ch]">
            Todo o maquinário, <span className="italic text-[var(--color-text-muted)]">num só lugar.</span>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-[52ch] text-lead">
            Tratores, colheitadeiras, pulverizadores, plantadeiras e operadores — verificados e prontos para
            a próxima janela de safra.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          {MACHINES.map((m, i) => (
            <Reveal
              key={m.name}
              delay={i * 80}
              className={`group relative overflow-hidden rounded-3xl border border-[var(--color-hairline)] bg-[var(--color-surface)] ${
                m.span === 'lg' ? 'md:col-span-4 md:row-span-2 aspect-[16/14] md:aspect-auto md:min-h-[480px]' : 'md:col-span-2 aspect-[4/3]'
              }`}
            >
              <a href={APP_SIGNUP} className="block w-full h-full">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  sizes={m.span === 'lg' ? '(min-width:768px) 66vw, 100vw' : '(min-width:768px) 33vw, 100vw'}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/30 to-transparent" />
                <div className="absolute top-5 right-5 text-eyebrow font-mono text-[var(--color-text)]/70">
                  0{i + 1} / 0{MACHINES.length}
                </div>
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl leading-none tracking-tight text-[var(--color-text)]">
                      {m.name}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-[var(--color-text-muted)] max-w-[42ch]">
                      {m.desc}
                    </p>
                  </div>
                  <div className="hidden md:flex w-11 h-11 rounded-full border border-[var(--color-text)]/30 items-center justify-center text-[var(--color-text)] transition-all duration-300 group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-bg)]">
                    <Icon name="arrow" className="w-5 h-5" />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative py-24 md:py-32 border-y border-[var(--color-hairline)]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal>
          <Eyebrow>02 — Como funciona</Eyebrow>
        </Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <Reveal delay={120} className="lg:col-span-7">
            <h2 className="text-h1 max-w-[16ch]">
              Quatro passos. <br />
              <span className="italic text-[var(--color-text-muted)]">Zero atravessador.</span>
            </h2>
          </Reveal>
          <Reveal delay={240} className="lg:col-span-5 flex items-end">
            <p className="text-lead max-w-[40ch]">
              Você fala direto com quem opera a máquina. A gente só conecta — e registra.
            </p>
          </Reveal>
        </div>

        <ol className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-hairline)] border border-[var(--color-hairline)] rounded-3xl overflow-hidden">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 100}
              as="li"
              className="bg-[var(--color-bg)] p-8 md:p-10 relative group hover:bg-[var(--color-surface)] transition-colors duration-500"
            >
              <span className="numeral-outline absolute -top-2 right-4 text-[110px] md:text-[150px] pointer-events-none">
                {s.n}
              </span>
              <div className="relative">
                <span className="font-mono text-xs text-[var(--color-accent)]">{s.n}</span>
                <h3 className="mt-4 font-display text-3xl tracking-tight text-[var(--color-text)]">{s.title}</h3>
                <p className="mt-4 text-sm text-[var(--color-text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-16">
          <ProdutorBand />
          <PrestadorBand />
        </div>
      </div>
    </section>
  );
}

function ProdutorBand() {
  return (
    <Reveal className="relative rounded-3xl overflow-hidden border border-[var(--color-accent)]/30 bg-gradient-to-br from-[var(--color-accent)]/12 via-[var(--color-surface)] to-[var(--color-bg)] p-8 md:p-12">
      <div className="absolute -top-12 -right-12 text-[180px] md:text-[260px] numeral-outline opacity-40 pointer-events-none">
        P
      </div>
      <div className="relative">
        <Eyebrow>Para produtores</Eyebrow>
        <h3 className="mt-5 text-h2">Encontre. Combine. Colha.</h3>
        <ul className="mt-8 space-y-5">
          {PRODUTOR_BULLETS.map((b) => (
            <li key={b.title} className="flex gap-4">
              <span className="mt-1 inline-flex w-7 h-7 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] items-center justify-center shrink-0">
                <Icon name="check" className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-display text-xl tracking-tight">{b.title}</h4>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <a href={APP_SIGNUP} className="btn-primary mt-10">
          Buscar serviços
          <Icon name="arrow" className="w-4 h-4" />
        </a>
      </div>
    </Reveal>
  );
}

function PrestadorBand() {
  return (
    <Reveal
      delay={120}
      className="relative rounded-3xl overflow-hidden border border-[var(--color-hairline)] bg-[var(--color-surface)] p-8 md:p-12"
    >
      <div className="absolute -top-12 -right-12 text-[180px] md:text-[260px] numeral-outline opacity-40 pointer-events-none">
        S
      </div>
      <div className="relative">
        <Eyebrow>Para prestadores</Eyebrow>
        <h3 className="mt-5 text-h2">Rentabilize. Receba. Repita.</h3>
        <ul className="mt-8 space-y-5">
          {PRESTADOR_BULLETS.map((b) => (
            <li key={b.title} className="flex gap-4">
              <span className="mt-1 inline-flex w-7 h-7 rounded-full border border-[var(--color-accent)]/60 text-[var(--color-accent)] items-center justify-center shrink-0">
                <Icon name="check" className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-display text-xl tracking-tight">{b.title}</h4>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <a href={APP_SIGNUP} className="btn-ghost mt-10">
          Cadastrar equipamento
          <Icon name="arrow" className="w-4 h-4" />
        </a>
      </div>
    </Reveal>
  );
}

function Differentiators() {
  return (
    <section id="diferenciais" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Reveal className="lg:col-span-7">
            <Eyebrow>03 — Diferenciais</Eyebrow>
            <h2 className="mt-6 text-h1 max-w-[14ch]">
              Por que o Field Machine é{' '}
              <span className="italic text-[var(--color-text-muted)]">diferente.</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5 flex items-end">
            <p className="text-lead max-w-[40ch]">
              Marketplace P2P, sem comissão, com avaliação em quatro dimensões. O que faz sentido
              para quem está no campo.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIFFERENTIATORS.map((d, i) => (
            <Reveal
              key={d.title}
              delay={i * 80}
              className="surface surface-glow p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-1"
            >
              <span className="numeral-outline absolute -top-4 -right-4 text-[120px] md:text-[140px] pointer-events-none">
                {d.kicker}
              </span>
              <div className="relative">
                <span className="font-mono text-xs text-[var(--color-accent)]">0{i + 1}</span>
                <h3 className="mt-5 font-display text-2xl tracking-tight">{d.title}</h3>
                <p className="mt-3 text-sm text-[var(--color-text-muted)] leading-relaxed">{d.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveActivity() {
  const [feed, setFeed] = useState<typeof ACTIVITY_POOL>(() => ACTIVITY_POOL.slice(0, 6));
  const cursorRef = useRef(6);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const id = setInterval(() => {
      cursorRef.current = (cursorRef.current + 1) % ACTIVITY_POOL.length;
      const next = ACTIVITY_POOL[cursorRef.current];
      setFeed((prev) => [{ ...next, minutes: 1 }, ...prev.slice(0, 5)]);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="atividade" className="relative py-24 md:py-32 bg-[var(--color-surface)]/40 border-y border-[var(--color-hairline)] overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-[var(--color-accent)]/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--color-accent)]/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[var(--color-accent)]/10" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
          <Eyebrow>
            <span className="pulse-dot inline-block" />
            <span>Ao vivo</span>
          </Eyebrow>
          <h2 className="mt-6 text-h1 max-w-[12ch]">
            Acontecendo <br />
            <span className="italic text-[var(--color-text-muted)]">agora.</span>
          </h2>
          <p className="mt-6 max-w-[40ch] text-lead">
            Conexões reais entre produtores e prestadores nas últimas horas. Atualiza em tempo real.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="surface p-2 md:p-3 max-h-[520px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-3">
                <span className="pulse-dot" />
                <span className="font-mono text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
                  Feed · marketplace
                </span>
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {feed.length.toString().padStart(2, '0')} eventos
              </span>
            </div>
            <ul className="divide-y divide-[var(--color-hairline)]">
              {feed.map((row, i) => (
                <li
                  key={`${row.text}-${row.minutes}-${i}`}
                  className="activity-row px-5 py-5 flex items-start gap-4"
                  data-state="visible"
                >
                  <span className="font-mono text-xs text-[var(--color-accent)] mt-1 min-w-[60px]">
                    há {row.minutes < 60 ? `${row.minutes}m` : `${Math.floor(row.minutes / 60)}h`}
                  </span>
                  <div className="flex-1">
                    <p className="text-[var(--color-text)] text-[0.95rem] leading-snug">{row.text}</p>
                    <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)] tracking-wide uppercase">
                      {row.city}
                    </p>
                  </div>
                  <Icon name="arrow" className="w-4 h-4 text-[var(--color-text-muted)] mt-1" />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <Reveal>
          <Eyebrow>04 — Depoimentos</Eyebrow>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-6 text-h1 max-w-[16ch]">
            Quem está no campo,{' '}
            <span className="italic text-[var(--color-text-muted)]">já entendeu.</span>
          </h2>
        </Reveal>

        <div className="mt-16 snap-row flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="snap-item surface p-8 md:p-10 w-[85vw] md:w-[440px] flex flex-col gap-6 relative"
            >
              <span
                aria-hidden
                className="font-display text-[140px] leading-[0.5] text-[var(--color-accent)]/40 absolute -top-2 -left-1"
              >
                &ldquo;
              </span>
              <p className="relative font-display text-2xl md:text-[1.7rem] leading-snug text-[var(--color-text)] tracking-tight pt-10">
                {t.text}
              </p>
              <footer className="mt-auto pt-6 border-t border-[var(--color-hairline)]">
                <div className="font-mono text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
                  {t.city}
                </div>
                <div className="font-display text-lg mt-1">{t.name}</div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 border-t border-[var(--color-hairline)]">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <Reveal className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>05 — Perguntas frequentes</Eyebrow>
          <h2 className="mt-6 text-h1 max-w-[12ch]">
            Tem dúvida? <br />
            <span className="italic text-[var(--color-text-muted)]">A gente responde.</span>
          </h2>
          <p className="mt-6 text-lead max-w-[36ch]">
            O essencial sobre como o marketplace funciona. Não achou aqui? Chama no chat.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <ul className="divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
            {FAQS.map((f) => (
              <li key={f.question}>
                <details className="group">
                  <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none">
                    <span className="font-display text-xl md:text-2xl tracking-tight text-[var(--color-text)]">
                      {f.question}
                    </span>
                    <span className="w-9 h-9 rounded-full border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-text-muted)] shrink-0 transition-all duration-300 group-open:bg-[var(--color-accent)] group-open:border-[var(--color-accent)] group-open:text-[var(--color-bg)] group-open:rotate-45">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <div className="pb-6 -mt-2 max-w-[60ch] text-[var(--color-text-muted)] leading-relaxed">
                    {f.answer}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function DualCloser() {
  return (
    <section id="comecar" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        <Reveal className="mb-12 max-w-[700px]">
          <Eyebrow>06 — Comece hoje</Eyebrow>
          <h2 className="mt-6 text-h1">
            O próximo serviço <br />
            <span className="italic text-[var(--color-text-muted)]">já está na rede.</span>
          </h2>
          <p className="mt-6 text-lead max-w-[42ch]">
            Cadastro em 2 minutos. Sem cartão, sem fidelidade, sem taxa.
          </p>
        </Reveal>

        <div className="split-row flex flex-col md:flex-row gap-4 md:gap-2 min-h-[420px]">
          <a
            href={APP_SIGNUP}
            className="split-card relative overflow-hidden rounded-3xl block min-h-[360px] md:min-h-[480px]"
          >
            <Image
              src="/images/hero.jpg"
              alt="Produtor"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-bg)] via-[var(--color-bg)]/60 to-[var(--color-accent)]/20" />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
              <span className="text-eyebrow text-[var(--color-text)]">Para produtores</span>
              <div>
                <h3 className="font-display text-5xl md:text-7xl lowercase leading-[0.95] tracking-tight">
                  buscar.
                </h3>
                <div className="mt-6 inline-flex items-center gap-3 text-[var(--color-text)] group">
                  <span className="text-sm font-medium">Encontrar máquina</span>
                  <span className="w-9 h-9 rounded-full bg-[var(--color-accent)] text-[var(--color-bg)] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </a>

          <a
            href={APP_SIGNUP}
            className="split-card relative overflow-hidden rounded-3xl block min-h-[360px] md:min-h-[480px]"
          >
            <Image
              src="/images/implements.jpg"
              alt="Prestador"
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-bg)] via-[var(--color-bg)]/60 to-[var(--color-signal)]/20" />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
              <span className="text-eyebrow text-[var(--color-text)]">Para prestadores</span>
              <div>
                <h3 className="font-display text-5xl md:text-7xl lowercase leading-[0.95] tracking-tight">
                  oferecer.
                </h3>
                <div className="mt-6 inline-flex items-center gap-3 text-[var(--color-text)] group">
                  <span className="text-sm font-medium">Cadastrar equipamento</span>
                  <span className="w-9 h-9 rounded-full border border-[var(--color-text)]/40 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-bg)] transition-all">
                    <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-hairline)] bg-[var(--color-bg)] pt-20 pb-12 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <div className="font-display text-4xl md:text-5xl leading-none tracking-[-0.03em]">
              field<span className="italic">machine</span>
            </div>
            <p className="mt-6 max-w-[36ch] text-sm text-[var(--color-text-muted)] leading-relaxed">
              Conexão direta entre quem produz e quem opera. Sem atravessador.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-eyebrow mb-5">Plataforma</h4>
            <ul className="space-y-3 text-sm">
              <li><a href={APP_SIGNUP} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Criar conta</a></li>
              <li><a href={APP_LOGIN} className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Entrar</a></li>
              <li><a href="#como-funciona" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Como funciona</a></li>
              <li><a href="#faq" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-eyebrow mb-5">Empresa</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://app.fieldmachine.com.br/sobre" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Sobre</a></li>
              <li><a href="https://app.fieldmachine.com.br/contato" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Contato</a></li>
              <li><a href="https://app.fieldmachine.com.br/privacidade" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Privacidade</a></li>
              <li><a href="https://app.fieldmachine.com.br/termos" className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">Termos</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-eyebrow mb-5">Contato</h4>
            <ul className="space-y-3 text-sm font-mono text-[var(--color-text-muted)]">
              <li><a href="mailto:contato@fieldmachine.com.br" className="hover:text-[var(--color-accent)] transition-colors">contato@fieldmachine.com.br</a></li>
              <li>(45) 99144-7004</li>
              <li>Curitiba · PR · Brasil</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-hairline)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-[var(--color-text-muted)] font-mono tracking-wide">
          <span>© {new Date().getFullYear()} Field Machine Rental — Todos os direitos reservados</span>
          <span className="flex items-center gap-2">
            <span className="pulse-dot inline-block" /> feito no brasil
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <CityMarquee />
        <CatalogBento />
        <ComoFunciona />
        <Differentiators />
        <LiveActivity />
        <Testimonials />
        <FAQ />
        <DualCloser />
      </main>
      <Footer />
    </>
  );
}
