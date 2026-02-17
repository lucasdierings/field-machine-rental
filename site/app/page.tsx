export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-800">Field Machine</h1>
        <a
          href="https://app.fieldmachine.com.br/login"
          className="text-green-700 hover:text-green-900"
        >
          Entrar
        </a>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Alugue equipamentos agrícolas com segurança
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conectamos proprietários e locatários de máquinas agrícolas.
          Reserva online, pagamento seguro e suporte dedicado.
        </p>
        <a
          href="https://app.fieldmachine.com.br/signup"
          className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Começar agora grátis
        </a>
      </section>

      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🚜</div>
          <h3 className="text-xl font-semibold mb-2">Para locadores</h3>
          <p className="text-gray-600">Monetize equipamentos ociosos com gestão completa</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Reserva fácil</h3>
          <p className="text-gray-600">Encontre e reserve máquinas em poucos cliques</p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Pagamento seguro</h3>
          <p className="text-gray-600">Transações protegidas e suporte dedicado</p>
        </div>
      </section>
    </main>
  );
}
