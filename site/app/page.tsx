export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navegação */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🚜</span>
            <h1 className="text-2xl font-bold text-green-800">
              Field Machine
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#como-funciona"
              className="text-gray-700 hover:text-green-700 transition"
            >
              Como funciona
            </a>
            <a
              href="#beneficios"
              className="text-gray-700 hover:text-green-700 transition"
            >
              Benefícios
            </a>
            <a
              href="https://app.fieldmachine.com.br/login"
              className="text-green-700 hover:text-green-900 font-medium transition"
            >
              Entrar
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Alugue equipamentos agrícolas<br />
          <span className="text-green-600">com segurança</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conectamos proprietários e locatários de máquinas agrícolas.
          Reserva online, pagamento seguro e suporte dedicado.
        </p>
        <a
          href="https://app.fieldmachine.com.br/signup"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Começar agora grátis →
        </a>
        <p className="text-sm text-gray-500 mt-4">
          Sem cartão de crédito • Configuração em 2 minutos
        </p>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Como funciona
          </h3>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">1️⃣</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Cadastre-se</h4>
              <p className="text-gray-600">
                Crie sua conta gratuitamente em menos de 2 minutos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">2️⃣</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Busque máquinas</h4>
              <p className="text-gray-600">
                Encontre equipamentos próximos a você com filtros avançados
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">3️⃣</span>
              </div>
              <h4 className="font-semibold text-lg mb-2">Reserve e use</h4>
              <p className="text-gray-600">
                Faça a reserva online e combine retirada diretamente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-4">
            Por que escolher Field Machine?
          </h3>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Solução completa para locadores e locatários
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Para Locadores */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="text-4xl mb-4">🚜</div>
              <h4 className="text-2xl font-bold mb-4">Para locadores</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Monetize equipamentos ociosos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Gestão completa de reservas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Pagamentos seguros e rastreáveis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Controle total de disponibilidade</span>
                </li>
              </ul>
            </div>

            {/* Para Locatários */}
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-2xl font-bold mb-4">Para locatários</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Equipamentos verificados e seguros</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Reserva rápida e online</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Suporte dedicado 24/7</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Economia em comparação com compra</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-green-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h3>
          <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
            Cadastre-se gratuitamente e comece a alugar ou locar
            equipamentos agrícolas hoje mesmo.
          </p>
          <a
            href="https://app.fieldmachine.com.br/signup"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg"
          >
            Criar conta grátis →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🚜</span>
            <span className="text-xl font-bold text-white">Field Machine</span>
          </div>
          <p className="mb-4">
            Plataforma de aluguel de equipamentos agrícolas
          </p>
          <p className="text-sm">
            © 2025 Field Machine Rental. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
