import Image from 'next/image';

const machines = [
  {
    name: 'Tratores',
    img: '/images/tractor.jpg',
    desc: 'John Deere, Valtra, New Holland e outras marcas',
  },
  {
    name: 'Colheitadeiras',
    img: '/images/combine.jpg',
    desc: 'Para soja, milho, trigo e outras culturas',
  },
  {
    name: 'Pulverizadores',
    img: '/images/sprayer.jpg',
    desc: 'Autopropelidos e acoplados de grande porte',
  },
  {
    name: 'Plantadeiras',
    img: '/images/planter.jpg',
    desc: 'Plantio direto e convencional, múltiplas linhas',
  },
];

const testimonials = [
  {
    name: 'João Silva',
    city: 'Cascavel, PR',
    text: 'Consegui contratar um serviço de colheita quando minha máquina quebrou na safra. Salvou meu plantio e economizei muito.',
  },
  {
    name: 'Maria Santos',
    city: 'Londrina, PR',
    text: 'Como proprietária, consegui rentabilizar meu trator que ficava parado. A plataforma é segura e o processo é muito simples.',
  },
  {
    name: 'Pedro Oliveira',
    city: 'Maringá, PR',
    text: 'Excelente plataforma! Encontrei rapidamente um pulverizador na minha região. Processo transparente e seguro.',
  },
];

const faqs = [
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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── NAVBAR ──────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white tracking-tight">
              Field<span className="text-green-400">Machine</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#maquinas" className="hover:text-green-400 transition">Máquinas</a>
            <a href="#como-funciona" className="hover:text-green-400 transition">Como funciona</a>
            <a href="#numeros" className="hover:text-green-400 transition">Números</a>
            <a href="#beneficios" className="hover:text-green-400 transition">Benefícios</a>
            <a href="#faq" className="hover:text-green-400 transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://app.fieldmachine.com.br/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Entrar
            </a>
            <a
              href="https://app.fieldmachine.com.br/cadastro"
              className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Criar conta grátis
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Lavoura de soja com maquinário agrícola"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
        </div>

        <div className="relative container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block bg-green-900/60 border border-green-700/50 text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Plataforma #1 de serviços do agronegócio no Brasil
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Plataforma de Serviços
              <br />
              <span className="text-green-400">para o</span>
              <br />
              Agronegócio
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Conectamos produtores rurais e prestadores de serviço agrícola.
              Sem taxas, sem intermediários — combine direto e acerte entre vocês.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://app.fieldmachine.com.br/cadastro"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold transition shadow-lg shadow-green-900/40 hover:shadow-green-700/40"
              >
                Começar grátis →
              </a>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl text-lg font-semibold transition hover:bg-white/5"
              >
                Ver como funciona
              </a>
            </div>
            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Sem taxas
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Pagamento direto
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Avaliações completas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NÚMEROS / STATS ─────────────────────── */}
      <section id="numeros" className="py-20 bg-gray-900 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Números que Comprovam Nossa Confiabilidade
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Produtores já confiam no FieldMachine para suas necessidades agrícolas
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: '91', label: 'Máquinas disponíveis', desc: 'Equipamentos verificados' },
              { value: '389', label: 'Produtores cadastrados', desc: 'Rede confiável' },
              { value: '96%', label: 'Satisfação', desc: 'Clientes satisfeitos' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-8 hover:border-green-700/50 transition">
                  <p className="text-5xl md:text-6xl font-extrabold text-green-400 mb-3">{s.value}</p>
                  <p className="text-lg font-semibold text-white mb-1">{s.label}</p>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA — FLUXO RÁPIDO ────────── */}
      <section id="como-funciona" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Como Funciona</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Processo simples e direto para conectar produtores e prestadores de serviço
            </p>
          </div>

          {/* Steps flow */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-green-700/30 via-green-500 to-green-700/30" />

            {[
              { step: '01', icon: '🔍', title: 'Busque', desc: 'Encontre a máquina ideal para sua necessidade' },
              { step: '02', icon: '🤝', title: 'Conecte', desc: 'Entre em contato direto com o prestador' },
              { step: '03', icon: '💬', title: 'Combine', desc: 'Negocie valores e acertem diretamente' },
              { step: '04', icon: '⭐', title: 'Avalie', desc: 'Avalie o serviço, operador, máquina e cliente' },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 hover:border-green-700/50 transition hover:shadow-lg hover:shadow-green-900/20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/40 border-2 border-green-500 flex items-center justify-center text-2xl relative z-10">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dual columns — Para Produtores / Para Prestadores */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Para Produtores */}
            <div className="bg-gradient-to-br from-green-950/60 to-gray-900 border border-green-800/40 rounded-2xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-900/60 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  🌾
                </div>
                <h3 className="text-2xl font-bold">Para Produtores</h3>
              </div>
              <p className="text-gray-400 mb-6">Encontre e contrate serviços facilmente</p>
              <ul className="space-y-5">
                {[
                  { icon: '🔍', title: 'Busque', desc: 'Encontre máquinas próximas à sua propriedade' },
                  { icon: '💬', title: 'Negocie', desc: 'Chat direto com o proprietário para combinar valores e detalhes' },
                  { icon: '🤝', title: 'Acerte Direto', desc: 'Combine o pagamento entre vocês — sem intermediários' },
                  { icon: '⭐', title: 'Avalie', desc: 'Avalie o serviço, o operador e a máquina para ajudar a comunidade' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href="https://app.fieldmachine.com.br/cadastro"
                className="mt-8 inline-block bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition w-full text-center"
              >
                Buscar serviços →
              </a>
            </div>

            {/* Para Prestadores */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900 border border-white/10 rounded-2xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gray-700/60 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  🚜
                </div>
                <h3 className="text-2xl font-bold">Para Prestadores de Serviço</h3>
              </div>
              <p className="text-gray-400 mb-6">Monetize suas máquinas e ofereça seus serviços</p>
              <ul className="space-y-5">
                {[
                  { icon: '📝', title: 'Cadastre', desc: 'Anuncie gratuitamente suas máquinas e serviços' },
                  { icon: '👥', title: 'Conecte-se', desc: 'Receba solicitações de produtores da sua região' },
                  { icon: '📈', title: 'Rentabilize', desc: 'Equipamento parado gerando renda — sem taxas da plataforma' },
                  { icon: '⭐', title: 'Construa Reputação', desc: 'Boas avaliações atraem mais clientes para seus serviços' },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <a
                href="https://app.fieldmachine.com.br/cadastro"
                className="mt-8 inline-block border border-white/20 hover:border-green-700/60 hover:bg-green-900/20 text-white px-6 py-3 rounded-xl font-semibold transition w-full text-center"
              >
                Cadastrar equipamento →
              </a>
            </div>
          </div>

          {/* Peer-to-peer badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 max-w-3xl mx-auto">
            {[
              { icon: '💰', label: '0% Taxa', desc: 'Zero comissão sobre o serviço' },
              { icon: '💬', label: 'Negociação Livre', desc: 'Combine valores diretamente' },
              { icon: '👥', label: 'Comunidade', desc: 'Avaliações reais de confiança' },
            ].map((b) => (
              <div key={b.label} className="bg-gray-800/40 border border-white/10 rounded-xl px-6 py-4 text-center flex-1 min-w-[160px]">
                <span className="text-2xl block mb-2">{b.icon}</span>
                <p className="font-semibold text-white text-sm">{b.label}</p>
                <p className="text-xs text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÁQUINAS DISPONÍVEIS ─────────────────── */}
      <section id="maquinas" className="py-24 bg-gray-900 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Equipamentos disponíveis
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Encontre o equipamento certo para cada fase do seu cultivo
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {machines.map((m) => (
              <a
                key={m.name}
                href="https://app.fieldmachine.com.br/cadastro"
                className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-green-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/30"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={m.img}
                    alt={m.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <h3 className="font-bold text-lg text-white">{m.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{m.desc}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://app.fieldmachine.com.br/cadastro"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-green-700/60 text-gray-300 hover:text-green-400 px-6 py-3 rounded-xl font-semibold transition"
            >
              Ver todos os equipamentos →
            </a>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ─────────────────────────── */}
      <section id="beneficios" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Por que escolher o FieldMachine?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Vantagens exclusivas para produtores e prestadores de serviço
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: '💰', title: 'Sem Taxas', desc: 'Zero comissão. O valor negociado é 100% seu. Sem surpresas.' },
              { icon: '⚡', title: 'Agilidade', desc: 'Encontre equipamentos disponíveis na sua região em minutos.' },
              { icon: '🔒', title: 'Segurança', desc: 'Avaliações verificadas, perfis completos e chat integrado.' },
              { icon: '📍', title: 'Proximidade', desc: 'Busca por localização. Encontre máquinas perto de você.' },
              { icon: '💬', title: 'Negociação Direta', desc: 'Converse e combine valores sem intermediários.' },
              { icon: '⭐', title: 'Reputação', desc: 'Avaliações de 4 dimensões: serviço, operador, máquina e cliente.' },
            ].map((b) => (
              <div key={b.title} className="bg-gray-800/40 border border-white/10 rounded-2xl p-8 hover:border-green-700/50 transition hover:shadow-lg hover:shadow-green-900/20">
                <span className="text-3xl block mb-4">{b.icon}</span>
                <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                <p className="text-gray-400 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ────────────────────────── */}
      <section className="py-24 bg-gray-900 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              O que Nossos Usuários Dizem
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Depoimentos reais de produtores e proprietários que confiam no FieldMachine
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-800/60 border border-white/10 rounded-2xl p-8 hover:border-green-700/50 transition"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-6 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Tire todas as suas dúvidas sobre o FieldMachine
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-gray-800/40 border border-white/10 rounded-xl overflow-hidden hover:border-green-700/50 transition"
              >
                <summary className="cursor-pointer p-6 font-semibold text-white flex justify-between items-center">
                  {faq.question}
                  <svg
                    className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/implements.jpg"
            alt="Campo agrícola"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-950/90" />
        </div>
        <div className="relative container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Pronto para transformar seu
            <span className="text-green-400"> negócio agrícola</span>?
          </h2>
          <p className="text-gray-300 text-xl mb-10">
            Cadastre-se gratuitamente e comece a conectar-se com produtores
            e prestadores de serviço. Sem taxas, sem compromisso.
          </p>
          <a
            href="https://app.fieldmachine.com.br/cadastro"
            className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-xl text-xl font-bold transition shadow-xl shadow-green-900/50"
          >
            Criar conta grátis →
          </a>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-white/10 py-14">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-bold text-xl">
                  Field<span className="text-green-400">Machine</span>
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Plataforma de serviços agrícolas que conecta produtores e
                prestadores de serviço. Sem taxas, sem intermediários.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://app.fieldmachine.com.br/cadastro" className="hover:text-green-400 transition">Criar conta grátis</a></li>
                <li><a href="https://app.fieldmachine.com.br/login" className="hover:text-green-400 transition">Fazer login</a></li>
                <li><a href="#como-funciona" className="hover:text-green-400 transition">Como funciona</a></li>
                <li><a href="#faq" className="hover:text-green-400 transition">Perguntas frequentes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://app.fieldmachine.com.br/sobre" className="hover:text-green-400 transition">Sobre nós</a></li>
                <li><a href="https://app.fieldmachine.com.br/contato" className="hover:text-green-400 transition">Contato</a></li>
                <li><a href="https://app.fieldmachine.com.br/privacidade" className="hover:text-green-400 transition">Privacidade</a></li>
                <li><a href="https://app.fieldmachine.com.br/termos" className="hover:text-green-400 transition">Termos de uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>📧 <a href="mailto:contato@fieldmachine.com.br" className="hover:text-green-400 transition">contato@fieldmachine.com.br</a></li>
                <li>📱 (45) 99144-7004</li>
                <li>📍 Curitiba, Paraná</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Field Machine Rental. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
