
import { Header } from "@/components/ui/header";
import { EnhancedFooter } from "@/components/ui/enhanced-footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Política de Privacidade"
                description="Entenda como coletamos e protegemos seus dados conforme a LGPD."
                canonical="/privacidade"
            />
            <Header />
            <main className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
                <p className="text-muted-foreground mb-8">
                    Última atualização: 30/03/2026
                </p>

                <Card className="mb-8">
                    <CardContent className="prose prose-slate max-w-none p-6 space-y-6">

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">1. Introdução</h2>
                            <p>
                                A <strong>Field Machine</strong> ("nós", "nosso" ou "plataforma") respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e compartilhamos suas informações, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
                            </p>
                            <p>
                                Ao utilizar nossa plataforma, você concorda com o tratamento de seus dados conforme descrito neste documento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">2. Dados Pessoais Coletados</h2>
                            <p>Coletamos os seguintes dados pessoais:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Dados de cadastro:</strong> Nome completo, CPF ou CNPJ, e-mail, telefone (celular com WhatsApp), senha criptografada</li>
                                <li><strong>Dados de localização:</strong> CEP, endereço, cidade, estado, pontos de referência</li>
                                <li><strong>Dados de perfil:</strong> Tipo de usuário (proprietário/locatário), tamanho da propriedade, culturas principais, quantidade de máquinas, experiência com aluguéis</li>
                                <li><strong>Dados de documentos:</strong> Fotos de documentos pessoais (RG, CNH, comprovante de endereço) para verificação de identidade</li>
                                <li><strong>Dados de uso:</strong> Informações sobre como você interage com a plataforma, reservas realizadas, mensagens trocadas, avaliações</li>
                                <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional, cookies</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">3. Finalidade do Tratamento</h2>
                            <p>Utilizamos seus dados pessoais para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Criação e gestão de conta:</strong> Permitir seu cadastro e autenticação na plataforma</li>
                                <li><strong>Intermediação de aluguéis:</strong> Conectar proprietários de máquinas agrícolas com locatários</li>
                                <li><strong>Execução de contrato:</strong> Processar reservas, pagamentos e serviços contratados</li>
                                <li><strong>Comunicação:</strong> Enviar notificações sobre reservas, mensagens de outros usuários, atualizações da plataforma</li>
                                <li><strong>Segurança:</strong> Verificar identidade, prevenir fraudes e garantir a segurança da plataforma</li>
                                <li><strong>Melhorias:</strong> Analisar o uso da plataforma para aprimorar funcionalidades e experiência do usuário</li>
                                <li><strong>Cumprimento legal:</strong> Atender obrigações legais, fiscais e regulatórias</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">4. Base Legal (LGPD)</h2>
                            <p>O tratamento de seus dados é fundamentado nas seguintes bases legais:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Consentimento (Art. 7º, I):</strong> Você consente expressamente ao aceitar esta política durante o cadastro</li>
                                <li><strong>Execução de contrato (Art. 7º, V):</strong> Necessário para fornecer os serviços de intermediação de aluguéis</li>
                                <li><strong>Legítimo interesse (Art. 7º, IX):</strong> Prevenir fraudes, garantir segurança e melhorar a plataforma</li>
                                <li><strong>Obrigação legal (Art. 7º, II):</strong> Cumprir determinações legais, fiscais e regulatórias</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">5. Compartilhamento de Dados</h2>
                            <p>Seus dados pessoais podem ser compartilhados com:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Outros usuários da plataforma:</strong> Proprietários e locatários visualizam informações básicas (nome, localização, avaliações) para fins de contratação</li>
                                <li><strong>Prestadores de serviço:</strong> Supabase (banco de dados e autenticação), processadores de pagamento, serviços de e-mail e SMS</li>
                                <li><strong>Autoridades competentes:</strong> Quando exigido por lei ou ordem judicial</li>
                            </ul>
                            <p>
                                <strong>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing sem seu consentimento explícito.</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">6. Armazenamento e Segurança</h2>
                            <p>
                                Seus dados são armazenados em servidores seguros fornecidos pela <strong>Supabase</strong> (localização: Estados Unidos, com conformidade GDPR). Implementamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda, destruição ou alteração, incluindo:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Criptografia de senhas (hash bcrypt)</li>
                                <li>Conexões HTTPS (SSL/TLS)</li>
                                <li>Controle de acesso baseado em permissões</li>
                                <li>Backups regulares</li>
                                <li>Monitoramento de segurança</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">7. Prazo de Retenção</h2>
                            <p>Seus dados pessoais serão mantidos enquanto:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Sua conta estiver ativa na plataforma</li>
                                <li>For necessário para cumprir obrigações legais (ex: dados fiscais por 5 anos)</li>
                                <li>For necessário para defesa em processos judiciais</li>
                            </ul>
                            <p>
                                Após o encerramento da conta, seus dados serão anonimizados ou excluídos, exceto quando houver obrigação legal de retenção.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">8. Seus Direitos (LGPD - Art. 18)</h2>
                            <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                                <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados</li>
                                <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar remoção de dados desnecessários ou tratados em desconformidade</li>
                                <li><strong>Portabilidade:</strong> Obter uma cópia dos seus dados em formato estruturado</li>
                                <li><strong>Revogação do consentimento:</strong> Retirar consentimento a qualquer momento</li>
                                <li><strong>Oposição:</strong> Opor-se ao tratamento realizado com base em legítimo interesse</li>
                            </ul>
                            <p>
                                Para exercer seus direitos, entre em contato pelo e-mail: <strong>contato@fieldmachine.com.br</strong>
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">9. Cookies</h2>
                            <p>
                                Utilizamos cookies e tecnologias similares para melhorar sua experiência, manter sua sessão autenticada e analisar o uso da plataforma. Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade da plataforma.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">10. Menores de Idade</h2>
                            <p>
                                Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se identificarmos dados de menores, eles serão excluídos imediatamente.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">11. Alterações nesta Política</h2>
                            <p>
                                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por e-mail ou aviso na plataforma. A data da última atualização é exibida no topo deste documento.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mt-6 mb-3">12. Contato e Encarregado de Dados (DPO)</h2>
                            <p>
                                Para dúvidas, solicitações ou reclamações sobre esta Política ou o tratamento de seus dados pessoais, entre em contato com nosso Encarregado de Proteção de Dados:
                            </p>
                            <div className="bg-muted p-4 rounded-lg mt-4">
                                <p><strong>E-mail:</strong> contato@fieldmachine.com.br</p>
                                <p><strong>Telefone:</strong> (45) 99144-7004</p>
                                <p><strong>Localização:</strong> Curitiba, Paraná</p>
                            </div>
                            <p className="mt-4">
                                Você também pode registrar reclamações junto à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong> pelo site{' '}
                                <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    www.gov.br/anpd
                                </a>.
                            </p>
                        </section>

                    </CardContent>
                </Card>
            </main>
            <EnhancedFooter />
        </div>
    );
};

export default Privacy;
