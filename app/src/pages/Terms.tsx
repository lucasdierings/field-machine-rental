
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Termos de Uso"
                description="Leia nossos termos de uso e condições de serviço da plataforma Field Machine."
                canonical="/termos"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">Termos de Uso</h1>
                <p className="text-muted-foreground mb-8">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </p>

                <Card className="mb-8">
                    <CardContent className="prose prose-slate max-w-none p-6 space-y-6">

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">1. Aceite dos Termos</h2>
                            <p>
                                Bem-vindo à <strong>Field Machine</strong>, uma plataforma digital que conecta proprietários de máquinas agrícolas com produtores rurais que desejam alugá-las. Ao acessar ou utilizar nossos serviços, você concorda em cumprir estes Termos de Uso. <strong>Se você não concordar com qualquer parte destes termos, não utilize a plataforma.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">2. Definições</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Plataforma:</strong> Site e aplicativos móveis da Field Machine</li>
                                <li><strong>Usuário:</strong> Qualquer pessoa que cria uma conta na plataforma</li>
                                <li><strong>Proprietário:</strong> Usuário que disponibiliza máquinas agrícolas para aluguel</li>
                                <li><strong>Locatário:</strong> Usuário que aluga máquinas agrícolas</li>
                                <li><strong>Serviços:</strong> Funcionalidades oferecidas pela plataforma (cadastro, busca, reserva, pagamento, mensagens, avaliações)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">3. Descrição dos Serviços</h2>
                            <p>
                                A Field Machine atua como <strong>intermediária</strong>, facilitando a conexão entre proprietários e locatários de máquinas agrícolas. <strong>Não somos proprietários das máquinas</strong> anunciadas e <strong>não somos responsáveis diretos</strong> pela execução dos serviços de aluguel.
                            </p>
                            <p>A plataforma oferece:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cadastro de máquinas agrícolas para aluguel</li>
                                <li>Sistema de busca e filtros</li>
                                <li>Agendamento e gestão de reservas</li>
                                <li>Sistema de mensagens entre usuários</li>
                                <li>Processamento de pagamentos (via parceiros)</li>
                                <li>Sistema de avaliações e reputação</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">4. Cadastro e Conta de Usuário</h2>
                            <h3 className="text-xl font-semibold mt-4 mb-2">4.1. Requisitos</h3>
                            <p>Para criar uma conta, você deve:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Ter pelo menos 18 anos de idade</li>
                                <li>Fornecer informações verdadeiras, completas e atualizadas</li>
                                <li>Possuir CPF ou CNPJ válido</li>
                                <li>Ter um e-mail e telefone válidos</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.2. Responsabilidades do Usuário</h3>
                            <p>Você se compromete a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Manter a confidencialidade da sua senha</li>
                                <li>Notificar imediatamente sobre uso não autorizado da sua conta</li>
                                <li>Atualizar suas informações de cadastro quando necessário</li>
                                <li>Não criar múltiplas contas sem autorização</li>
                                <li>Não transferir sua conta para terceiros</li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-4 mb-2">4.3. Verificação de Identidade</h3>
                            <p>
                                Podemos solicitar documentos (RG, CNH, comprovante de endereço) para verificar sua identidade e prevenir fraudes. A recusa em fornecer documentação pode resultar em suspensão ou encerramento da conta.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">5. Obrigações dos Proprietários</h2>
                            <p>Ao anunciar máquinas na plataforma, o proprietário se compromete a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Fornecer informações verdadeiras sobre a máquina (modelo, ano, estado de conservação, capacidade, etc.)</li>
                                <li>Definir preços e condições de aluguel de forma clara</li>
                                <li>Manter a disponibilidade atualizada no calendário</li>
                                <li>Entregar a máquina em condições de uso seguro</li>
                                <li>Possuir documentação regular da máquina (registro, IPVA, seguros, licenças)</li>
                                <li>Cumprir prazos e condições acordadas com o locatário</li>
                                <li>Responder mensagens em tempo hábil (até 24h)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">6. Obrigações dos Locatários</h2>
                            <p>Ao alugar uma máquina, o locatário se compromete a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Utilizar a máquina de forma adequada e para os fins acordados</li>
                                <li>Realizar manutenção básica durante o período de locação (limpeza, lubrificação)</li>
                                <li>Devolver a máquina nas mesmas condições recebidas (desgaste natural aceito)</li>
                                <li>Comunicar imediatamente ao proprietário sobre problemas ou danos</li>
                                <li>Pagar pelos danos causados por mau uso ou negligência</li>
                                <li>Não sublocar a máquina sem autorização expressa do proprietário</li>
                                <li>Respeitar prazos de devolução</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">7. Reservas e Pagamentos</h2>
                            <h3 className="text-xl font-semibold mt-4 mb-2">7.1. Processo de Reserva</h3>
                            <p>
                                As reservas são confirmadas após aceitação do proprietário e confirmação do pagamento. A Field Machine cobra uma <strong>taxa de serviço</strong> para manter a plataforma operando.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">7.2. Cancelamento</h3>
                            <p>Políticas de cancelamento:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Até 48h antes:</strong> Reembolso de 100% (exceto taxas de serviço)</li>
                                <li><strong>Entre 24h e 48h antes:</strong> Reembolso de 50%</li>
                                <li><strong>Menos de 24h antes:</strong> Sem reembolso</li>
                            </ul>
                            <p>
                                O proprietário pode cancelar sem penalidade apenas em casos de força maior (quebra da máquina, problemas mecânicos graves). Cancelamentos injustificados podem resultar em penalidades.
                            </p>

                            <h3 className="text-xl font-semibold mt-4 mb-2">7.3. Reembolsos</h3>
                            <p>
                                Reembolsos são processados em até 10 dias úteis. A Field Machine não é responsável por atrasos do processador de pagamento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">8. Taxas da Plataforma</h2>
                            <p>
                                A Field Machine cobra uma taxa de serviço sobre cada transação concluída. As taxas atuais são:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Taxa do locatário:</strong> [X]% sobre o valor da reserva</li>
                                <li><strong>Taxa do proprietário:</strong> [Y]% sobre o valor recebido</li>
                            </ul>
                            <p>
                                As taxas são divulgadas de forma transparente antes da confirmação da reserva.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">9. Conduta Proibida</h2>
                            <p>É expressamente proibido:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Publicar informações falsas, enganosas ou fraudulentas</li>
                                <li>Utilizar a plataforma para atividades ilegais</li>
                                <li>Assediar, ameaçar ou discriminar outros usuários</li>
                                <li>Tentar burlar o sistema de pagamentos (transações fora da plataforma)</li>
                                <li>Fazer scraping, crawling ou coleta automatizada de dados</li>
                                <li>Interferir no funcionamento da plataforma (ataques, exploits, vírus)</li>
                                <li>Criar avaliações falsas ou manipular reputação</li>
                                <li>Usar a plataforma para spam ou marketing não autorizado</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">10. Propriedade Intelectual</h2>
                            <p>
                                Todo o conteúdo da plataforma (textos, imagens, logotipos, design, código-fonte) é propriedade da Field Machine ou licenciado por terceiros. É proibido copiar, reproduzir, distribuir ou modificar qualquer parte da plataforma sem autorização expressa.
                            </p>
                            <p>
                                Ao enviar conteúdo (fotos de máquinas, descrições), você concede à Field Machine uma licença mundial, não exclusiva e gratuita para usar, reproduzir e exibir esse conteúdo na plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">11. Limitação de Responsabilidade</h2>
                            <p>
                                A Field Machine atua apenas como <strong>intermediária</strong>. Não nos responsabilizamos por:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Qualidade, segurança ou funcionamento das máquinas anunciadas</li>
                                <li>Comportamento, ações ou omissões dos usuários</li>
                                <li>Danos causados por máquinas defeituosas ou mal mantidas</li>
                                <li>Acidentes, lesões ou prejuízos decorrentes do uso de máquinas alugadas</li>
                                <li>Disputas entre proprietários e locatários</li>
                                <li>Perdas indiretas, lucros cessantes ou danos morais</li>
                            </ul>
                            <p>
                                <strong>Recomendamos que proprietários possuam seguro adequado para suas máquinas e que locatários verifiquem as condições antes de aceitar a locação.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">12. Resolução de Disputas</h2>
                            <p>
                                Em caso de conflitos entre usuários, recomendamos primeiro tentar resolver diretamente ou através da nossa equipe de suporte. Se não houver acordo, as partes podem recorrer à mediação ou arbitragem.
                            </p>
                            <p>
                                <strong>Foro:</strong> Fica eleito o foro da comarca de [CIDADE/ESTADO] para dirimir quaisquer questões oriundas destes Termos de Uso.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">13. Suspensão e Encerramento de Conta</h2>
                            <p>Podemos suspender ou encerrar sua conta, a qualquer momento, se:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Você violar estes Termos de Uso ou a Política de Privacidade</li>
                                <li>Houver suspeita de fraude, golpe ou atividade ilegal</li>
                                <li>Você fornecer informações falsas</li>
                                <li>Houver reclamações graves ou repetidas de outros usuários</li>
                                <li>Você tentar burlar sistemas de pagamento ou segurança</li>
                            </ul>
                            <p>
                                Você pode encerrar sua conta a qualquer momento através das configurações da plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">14. Modificações dos Termos</h2>
                            <p>
                                Reservamos o direito de modificar estes Termos de Uso a qualquer momento. Mudanças significativas serão comunicadas por e-mail ou aviso na plataforma com pelo menos 15 dias de antecedência. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">15. Disposições Gerais</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Estes termos constituem o acordo integral entre você e a Field Machine</li>
                                <li>A invalidade de qualquer cláusula não afeta as demais</li>
                                <li>A tolerância quanto ao descumprimento de cláusulas não constitui renúncia de direitos</li>
                                <li>Estes termos são regidos pelas leis brasileiras, incluindo o Código de Defesa do Consumidor e a LGPD</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">16. Contato</h2>
                            <p>
                                Para dúvidas, reclamações ou solicitações relacionadas a estes Termos de Uso:
                            </p>
                            <div className="bg-muted p-4 rounded-lg mt-4">
                                <p><strong>E-mail:</strong> contato@fieldmachine.com.br</p>
                                <p><strong>Suporte:</strong> suporte@fieldmachine.com.br</p>
                                <p><strong>Endereço:</strong> [Inserir endereço da empresa]</p>
                            </div>
                        </section>

                    </CardContent>
                </Card>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Terms;
