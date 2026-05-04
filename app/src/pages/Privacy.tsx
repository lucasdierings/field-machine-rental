<<<<<<< HEAD

=======
>>>>>>> origin/main
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Política de Privacidade"
<<<<<<< HEAD
                description="Entenda como coletamos e protegemos seus dados."
                canonical="/privacidade"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
                <p>Conteúdo da página de Política de Privacidade...</p>
=======
                description="Entenda como o FieldMachine coleta, usa e protege seus dados pessoais de acordo com a LGPD."
                canonical="/privacidade"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24 max-w-3xl">
                <article className="prose prose-neutral max-w-none">
                    <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
                    <p className="text-sm text-muted-foreground mb-8">
                        Última atualização: abril de 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">1. Quem somos</h2>
                        <p>
                            O FieldMachine é uma plataforma digital que conecta proprietários de
                            máquinas e equipamentos agrícolas a produtores rurais interessados em
                            contratar serviços de locação e operação. Esta Política de Privacidade
                            descreve como tratamos seus dados pessoais em conformidade com a{" "}
                            <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong>.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">2. Dados que coletamos</h2>
                        <p className="mb-2">Coletamos os seguintes dados pessoais:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                <strong>Dados cadastrais:</strong> nome completo, CPF ou CNPJ,
                                e-mail, telefone, data de nascimento.
                            </li>
                            <li>
                                <strong>Dados de localização:</strong> endereço, cidade, estado e CEP.
                            </li>
                            <li>
                                <strong>Documentos de verificação (KYC):</strong> RG, CNH,
                                comprovante de endereço, enviados voluntariamente para validação
                                de identidade.
                            </li>
                            <li>
                                <strong>Dados da operação:</strong> máquinas cadastradas, preços,
                                histórico de reservas e avaliações.
                            </li>
                            <li>
                                <strong>Dados de uso:</strong> endereço IP, tipo de dispositivo,
                                páginas visitadas, data/hora de acesso.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            3. Finalidades do tratamento
                        </h2>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Identificar e autenticar usuários na plataforma.</li>
                            <li>
                                Conectar produtores a proprietários e operadores de máquinas.
                            </li>
                            <li>Processar reservas, mensagens e avaliações.</li>
                            <li>Prevenir fraudes e garantir a segurança da plataforma.</li>
                            <li>Cumprir obrigações legais e regulatórias.</li>
                            <li>
                                Enviar comunicações operacionais e, mediante consentimento,
                                mensagens de marketing.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">4. Base legal</h2>
                        <p>
                            Tratamos seus dados com base nas hipóteses legais previstas na LGPD,
                            principalmente: execução de contrato (art. 7º, V), cumprimento de
                            obrigação legal (art. 7º, II), legítimo interesse (art. 7º, IX) e
                            consentimento (art. 7º, I) quando aplicável.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            5. Compartilhamento de dados
                        </h2>
                        <p>
                            Seus dados podem ser compartilhados com: (i) outros usuários da
                            plataforma estritamente no contexto de uma negociação iniciada por
                            você; (ii) prestadores de serviço contratados pelo FieldMachine
                            (provedor de nuvem, processador de pagamentos, serviço de e-mail);
                            (iii) autoridades competentes mediante requisição legal. Não
                            vendemos seus dados a terceiros.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">6. Armazenamento e segurança</h2>
                        <p>
                            Utilizamos criptografia em trânsito (HTTPS/TLS), Row Level Security
                            (RLS) no banco de dados e controles de acesso baseados em papéis.
                            Seus dados são armazenados em servidores no Brasil ou em regiões
                            com nível adequado de proteção. Documentos sensíveis (KYC) ficam em
                            bucket privado com acesso restrito.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">7. Retenção</h2>
                        <p>
                            Mantemos seus dados pelo tempo necessário para cumprir as
                            finalidades descritas ou por obrigação legal. Ao encerrar sua conta,
                            os dados pessoais serão anonimizados ou excluídos dentro de 90 dias,
                            exceto aqueles cuja retenção é exigida por lei (ex.: registros
                            fiscais).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">8. Seus direitos (titular)</h2>
                        <p className="mb-2">A LGPD garante a você os seguintes direitos:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Confirmação e acesso aos dados tratados.</li>
                            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
                            <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                            <li>Portabilidade dos dados para outro fornecedor.</li>
                            <li>Eliminação dos dados tratados com consentimento.</li>
                            <li>Revogação do consentimento a qualquer momento.</li>
                            <li>
                                Informação sobre entidades públicas e privadas com as quais
                                compartilhamos seus dados.
                            </li>
                        </ul>
                        <p className="mt-2">
                            Para exercer esses direitos, entre em contato pelo e-mail{" "}
                            <a
                                className="text-primary underline"
                                href="mailto:privacidade@fieldmachine.com.br"
                            >
                                privacidade@fieldmachine.com.br
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">9. Cookies</h2>
                        <p>
                            Utilizamos cookies estritamente necessários para o funcionamento da
                            plataforma (sessão, preferências). Não usamos cookies de
                            rastreamento publicitário sem consentimento.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">10. Encarregado (DPO)</h2>
                        <p>
                            Dúvidas ou solicitações relacionadas à proteção de dados podem ser
                            direcionadas ao nosso Encarregado pelo e-mail{" "}
                            <a
                                className="text-primary underline"
                                href="mailto:dpo@fieldmachine.com.br"
                            >
                                dpo@fieldmachine.com.br
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">
                            11. Alterações desta política
                        </h2>
                        <p>
                            Podemos atualizar esta Política periodicamente. Mudanças
                            significativas serão comunicadas por e-mail ou dentro da plataforma
                            com antecedência razoável.
                        </p>
                    </section>
                </article>
>>>>>>> origin/main
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Privacy;
