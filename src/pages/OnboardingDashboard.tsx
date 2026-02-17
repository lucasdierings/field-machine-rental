import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Circle,
  Search,
  Plus,
  Upload,
  Camera,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  action?: string;
  link?: string;
}

const OnboardingDashboard = () => {
  const [userType] = useState<'producer' | 'owner'>('producer'); // Simular tipo do usuário

  const [tasks, setTasks] = useState<OnboardingTask[]>([
    {
      id: 'email',
      title: 'Email verificado',
      description: 'Confirme seu email para receber notificações',
      completed: true,
      required: true,
    },
    {
      id: 'phone',
      title: 'Telefone verificado',
      description: 'Confirme seu telefone para contato direto',
      completed: true,
      required: true,
    },
    {
      id: 'photo',
      title: 'Adicionar foto do perfil',
      description: 'Aumente a confiança com uma foto real',
      completed: false,
      required: false,
      action: 'Adicionar Foto',
      link: '/perfil'
    },
    {
      id: 'documents',
      title: 'Documentos enviados',
      description: 'CPF/CNPJ e comprovante de endereço para verificação',
      completed: false,
      required: false,
      action: 'Enviar Documentos',
      link: '/perfil/documentos'
    },
    ...(userType === 'owner' ? [{
      id: 'first-machine',
      title: 'Primeira máquina cadastrada',
      description: 'Cadastre sua primeira máquina para começar a receber locações',
      completed: false,
      required: true,
      action: 'Cadastrar Máquina',
      link: '/add-machine'
    }] : [{
      id: 'first-search',
      title: 'Primeira busca realizada',
      description: 'Explore as máquinas disponíveis na sua região',
      completed: false,
      required: true,
      action: 'Buscar Máquinas',
      link: '/servicos-agricolas'
    }])
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const stats = [
    {
      title: "Máquinas Disponíveis",
      value: "1,234",
      description: "Na sua região",
      icon: Target,
      color: "text-primary"
    },
    {
      title: "Usuários Ativos",
      value: "15,678",
      description: "Na plataforma",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Locações Concluídas",
      value: "8,901",
      description: "Este mês",
      icon: TrendingUp,
      color: "text-primary"
    }
  ];

  const tips = userType === 'producer' ? [
    {
      title: "Complete seu perfil",
      description: "Perfis completos recebem 3x mais propostas",
      icon: CheckCircle
    },
    {
      title: "Planeje com antecedência",
      description: "Reserve máquinas com 15 dias de antecedência para melhores preços",
      icon: Calendar
    },
    {
      title: "Mantenha contato",
      description: "Responda rapidamente às mensagens dos proprietários",
      icon: MessageSquare
    }
  ] : [
    {
      title: "Fotos de qualidade",
      description: "Máquinas com fotos profissionais são alugadas 5x mais",
      icon: Camera
    },
    {
      title: "Preços competitivos",
      description: "Verifique os preços da região para manter competitividade",
      icon: Target
    },
    {
      title: "Disponibilidade atualizada",
      description: "Mantenha seu calendário sempre atualizado",
      icon: Calendar
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Boas-vindas */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Bem-vindo ao FieldMachine! 🚜
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {userType === 'producer'
                ? 'Você está a poucos passos de encontrar as máquinas perfeitas para sua produção!'
                : 'Você está a poucos passos de começar a gerar renda extra com suas máquinas!'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checklist de Onboarding */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">
                      Complete seu perfil ({Math.round(progressPercentage)}%)
                    </CardTitle>
                    <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                      {completedTasks}/{totalTasks} concluído
                    </Badge>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className="text-primary hover:text-primary-glow transition-colors"
                          >
                            {task.completed ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>
                          <div>
                            <h4 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.title}
                              {task.required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          </div>
                        </div>
                        {!task.completed && task.action && (
                          <Button asChild size="sm">
                            <Link to={task.link || '#'}>
                              {task.action}
                            </Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call-to-Actions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {userType === 'producer' ? (
                  <>
                    <Card className="p-6 bg-gradient-primary text-primary-foreground">
                      <div className="flex items-center gap-4">
                        <Search className="w-8 h-8" />
                        <div>
                          <h3 className="font-bold text-lg">Buscar Máquinas</h3>
                          <p className="text-sm opacity-90">
                            Encontre equipamentos na sua região
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      >
                        <Link to="/servicos-agricolas">
                          Começar Busca
                        </Link>
                      </Button>
                    </Card>

                    <Card className="p-6 bg-gradient-card">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-8 h-8 text-accent" />
                        <div>
                          <h3 className="font-bold text-lg">Planejar Safra</h3>
                          <p className="text-sm text-muted-foreground">
                            Organize seu calendário agrícola
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="w-full mt-4">
                        <Link to="/planejamento">
                          Ver Calendário
                        </Link>
                      </Button>
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="p-6 bg-gradient-primary text-primary-foreground">
                      <div className="flex items-center gap-4">
                        <Plus className="w-8 h-8" />
                        <div>
                          <h3 className="font-bold text-lg">Cadastrar Máquina</h3>
                          <p className="text-sm opacity-90">
                            Comece a gerar renda hoje mesmo
                          </p>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                      >
                        <Link to="/add-machine">
                          Cadastrar Agora
                        </Link>
                      </Button>
                    </Card>

                    <Card className="p-6 bg-gradient-card">
                      <div className="flex items-center gap-4">
                        <TrendingUp className="w-8 h-8 text-accent" />
                        <div>
                          <h3 className="font-bold text-lg">Calculadora de Renda</h3>
                          <p className="text-sm text-muted-foreground">
                            Veja quanto pode ganhar
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="w-full mt-4">
                        <Link to="/calculadora">
                          Calcular Agora
                        </Link>
                      </Button>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar com estatísticas e dicas */}
            <div className="space-y-6">
              {/* Estatísticas */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Números da Plataforma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dicas */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Dicas para {userType === 'producer' ? 'Produtores' : 'Proprietários'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <tip.icon className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Suporte */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Precisa de Ajuda?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nossa equipe está pronta para ajudar você a começar
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full text-left justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat ao Vivo
                    </Button>
                    <Button variant="outline" className="w-full text-left justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      (11) 99999-9999
                    </Button>
                    <Button variant="outline" className="w-full text-left justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      ajuda@fieldmachine.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OnboardingDashboard;