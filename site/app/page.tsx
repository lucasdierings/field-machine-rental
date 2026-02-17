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

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* ── NAVBAR ──────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚜</span>
            <span className="text-xl font-bold text-white tracking-tight">
              Field Machine
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#maquinas" className="hover:text-green-400 transition">Máquinas</a>
            <a href="#como-funciona" className="hover:text-green-400 transition">Como funciona</a>
            <a href="#beneficios" className="hover:text-green-400 transition">Benefícios</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://app.fieldmachine.com.br/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Entrar
            </a>
            <a
              href="https://app.fieldmachine.com.br/signup"
              className="text-sm bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              Criar conta grátis
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Lavoura de soja com maquinário agrícola"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/40" />
        </div>

        <div className="relative container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-2xl">
            <span className="inline-block bg-green-900/60 border border-green-700/50 text-green-400 text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Plataforma #1 de aluguel agrícola no Brasil
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Alugue equipamentos
              <br />
              <span className="text-green-400">agrícolas</span> com
              <br />
              segurança total
            </h1>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Conectamos proprietários e locatários de máquinas agrícolas.
              Reserva 100% online, pagamento protegido e suporte dedicado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://app.fieldmachine.com.br/signup"
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
            <p className="mt-4 text-sm text-gray-500">
              Sem cartão de crédito • Configuração em 2 minutos • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────── */}
      <section className="bg-gray-900 border-y border-white/10 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Equipamentos cadastrados' },
              { value: '120+', label: 'Cidades atendidas' },
              { value: '1.200+', label: 'Reservas realizadas' },
              { value: '4.8★', label: 'Avaliação média' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-green-400">{s.value}</p>
                <p className="text-sm text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MÁQUINAS DISPONÍVEIS ─────────────────── */}
      <section id="maquinas" className="py-24">
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
                href="https://app.fieldmachine.com.br/signup"
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
              href="https://app.fieldmachine.com.br/signup"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-green-700/60 text-gray-300 hover:text-green-400 px-6 py-3 rounded-xl font-semibold transition"
            >
              Ver todos os equipamentos →
            </a>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ───────────────────────── */}
      <section id="como-funciona" className="bg-gray-900 py-24 border-y border-white/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Como funciona</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Do cadastro à reserva em menos de 5 minutos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Crie sua conta',
                desc: 'Cadastre-se gratuitamente como locador ou locatário. Verificação simples e rápida.',
              },
              {
                step: '02',
                title: 'Encontre o equipamento',
                desc: 'Filtre por tipo, localização, disponibilidade e valor. Fotos e especificações completas.',
              },
              {
                step: '03',
                title: 'Reserve e combine',
                desc: 'Faça a reserva online, pague com segurança e combine os detalhes com o locador.',
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-gray-800/60 border border-white/10 rounded-2xl p-8 hover:border-green-700/50 transition">
                <span className="text-6xl font-black text-green-900 select-none absolute top-6 right-6">
                  {item.step}
                </span>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ─────────────────────────── */}
      <section id="beneficios" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">
              Para quem é o Field Machine?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Solução completa para os dois lados do negócio
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Locadores */}
            <div className="bg-gradient-to-br from-green-950/60 to-gray-900 border border-green-800/40 rounded-2xl p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-900/60 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  🚜
                </div>
                <h3 className="text-2xl font-bold">Para locadores</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Monetize equipamentos parados na entressafra',
                  'Gestão completa de reservas e calendário',
                  'Pagamentos protegidos e garantidos',
                  'Controle total de disponibilidade e preço',
                  'Visibilidade para milhares de produtores',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300">
                    <span className="mt-1 text-green-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://app.fieldmachine.com.br/signup"
                className="mt-8 inline-block bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition w-full text-center"
              >
                Cadastrar meu equipamento →
              </a>
            </div>

            {/* Locatários */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900 border border-white/10 rounded-2xl p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gray-700/60 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                  🌾
                </div>
                <h3 className="text-2xl font-bold">Para locatários</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Acesso a centenas de equipamentos verificados',
                  'Reserve online em qualquer horário',
                  'Compare preços e avaliações reais',
                  'Sem burocracia — tudo pelo app',
                  'Suporte dedicado em caso de problemas',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300">
                    <span className="mt-1 text-green-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://app.fieldmachine.com.br/signup"
                className="mt-8 inline-block border border-white/20 hover:border-green-700/60 hover:bg-green-900/20 text-white px-6 py-3 rounded-xl font-semibold transition w-full text-center"
              >
                Encontrar equipamentos →
              </a>
            </div>
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
            Cadastre-se gratuitamente e comece a alugar ou locar equipamentos
            ainda hoje. Sem taxas iniciais, sem compromisso.
          </p>
          <a
            href="https://app.fieldmachine.com.br/signup"
            className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-xl text-xl font-bold transition shadow-xl shadow-green-900/50"
          >
            Criar conta grátis — é gratuito →
          </a>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-white/10 py-14">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚜</span>
                <span className="font-bold text-xl">Field Machine</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Plataforma de aluguel de máquinas e equipamentos agrícolas.
                Conectamos o agronegócio brasileiro com tecnologia e segurança.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-4">Plataforma</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://app.fieldmachine.com.br/signup" className="hover:text-green-400 transition">Criar conta grátis</a></li>
                <li><a href="https://app.fieldmachine.com.br/login" className="hover:text-green-400 transition">Fazer login</a></li>
                <li><a href="#como-funciona" className="hover:text-green-400 transition">Como funciona</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-300 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="https://app.fieldmachine.com.br/about" className="hover:text-green-400 transition">Sobre nós</a></li>
                <li><a href="https://app.fieldmachine.com.br/contact" className="hover:text-green-400 transition">Contato</a></li>
                <li><a href="https://app.fieldmachine.com.br/privacy" className="hover:text-green-400 transition">Privacidade</a></li>
                <li><a href="https://app.fieldmachine.com.br/terms" className="hover:text-green-400 transition">Termos de uso</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Field Machine Rental. Todos os direitos reservados. |
            CNPJ: 00.000.000/0001-00
          </div>
        </div>
      </footer>
    </div>
  );
}
