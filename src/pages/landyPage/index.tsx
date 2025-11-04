import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { sendContactEmail } from "@/shared/services/contactService"
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Cloud,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Server,
  Mail,
  Send,
} from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = () => {
    navigate('/login')
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!contactForm.name.trim() || contactForm.name.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (!contactForm.email.trim() || !contactForm.email.includes('@')) {
      toast.error('Debe proporcionar un correo electrónico válido')
      return
    }

    if (!contactForm.phone.trim() || contactForm.phone.length < 7 || contactForm.phone.length > 20) {
      toast.error('El teléfono debe tener entre 7 y 20 caracteres')
      return
    }

    if (!contactForm.message.trim() || contactForm.message.length < 10) {
      toast.error('El mensaje debe tener al menos 10 caracteres')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await sendContactEmail(contactForm)
      toast.success(response.message || '¡Mensaje enviado exitosamente! Te contactaremos pronto.')
      setContactForm({ name: '', email: '', phone: '', message: '' })
    } catch (error: any) {
      const errorMessage = error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Arrendando S.A.S</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Características
            </a>
            <a href="#modules" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Módulos
            </a>
            <a href="#benefits" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Beneficios
            </a>
            <a href="#contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
              Contacto
            </a>
          </nav>
          <Button onClick={handleLogin} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg font-medium">Solicitar Demo</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-bold mb-8 shadow-lg border border-blue-200">
            <Zap className="h-4 w-4" />
            Sistema de Información Gerencial
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6 text-balance leading-tight">
            Gestión Inmobiliaria Inteligente para tu Negocio
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 text-pretty leading-relaxed max-w-3xl mx-auto">
            Automatiza y optimiza la administración de propiedades en arrendamiento. Control total desde cualquier lugar
            del mundo con acceso remoto seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 text-base shadow-xl">
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 shadow-lg">
              Ver Demo en Vivo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200 bg-white shadow-inner">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
              <div className="text-sm text-slate-600 font-medium">Acceso Remoto</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">7</div>
              <div className="text-sm text-slate-600 font-medium">Módulos Integrados</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-sm text-slate-600 font-medium">Disponibilidad</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-sm text-slate-600 font-medium">Escalabilidad</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 text-balance">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty leading-relaxed">
            Gestiona propiedades, inquilinos, contratos y pagos con una plataforma completa y fácil de usar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 group hover:border-blue-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Gestión de Propiedades</h3>
            <p className="text-slate-600 leading-relaxed">
              Registro completo de inmuebles, control de características, estados y disponibilidad en tiempo real.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 group hover:border-emerald-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Gestión de Inquilinos</h3>
            <p className="text-slate-600 leading-relaxed">
              Base de datos completa con historial crediticio, referencias y seguimiento de comportamiento de pago.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 group hover:border-purple-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 to-violet-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Gestión de Contratos</h3>
            <p className="text-slate-600 leading-relaxed">
              Creación, administración y control de vencimientos con archivo digital de documentos.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 group hover:border-amber-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Gestión de Pagos</h3>
            <p className="text-slate-600 leading-relaxed">
              Control de recaudos, seguimiento de cartera vencida y generación automática de facturas.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-100 group hover:border-indigo-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Sistema de Reportes</h3>
            <p className="text-slate-600 leading-relaxed">
              Dashboards ejecutivos, reportes financieros e indicadores de gestión en tiempo real.
            </p>
          </Card>

          <Card className="p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-red-100 group hover:border-rose-300">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300 shadow-xl">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Notificaciones Inteligentes</h3>
            <p className="text-slate-600 leading-relaxed">
              Alertas automáticas de vencimientos, recordatorios de pagos y eventos importantes.
            </p>
          </Card>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Tecnología de vanguardia
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed mb-8">
                Desarrollado con las mejores prácticas y tecnologías modernas
              </p>
              
              {/* Cloud Platform Highlight */}
              <Card className="p-8 mb-12 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Cloud className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Sistema Multiplataforma en la Nube</h3>
                    <p className="text-gray-600 font-medium">100% Cloud Computing - Sin instalaciones</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto">
                  Es un Sistema con <strong>compatibilidad Multiplataforma</strong> que <strong>NO REQUIERE SER INSTALADO EN NINGÚN COMPUTADOR</strong>, 
                  ya que todos los servicios que brinda el sistema están alojados en la <strong>NUBE</strong> y solo es necesario 
                  contar con conexión a internet para acceder a todo el conjunto de servicios y soporte las <strong>24/7</strong>.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Escritorio</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Móvil</p>
                  </div>
                  <div className="text-center">
                    <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Web</p>
                  </div>
                  <div className="text-center">
                    <Cloud className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Nube</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Technology Stack */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-8">Stack Tecnológico</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* Frontend Technologies */}
                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-2xl font-bold text-white">R</div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">React</h4>
                  <p className="text-xs text-slate-600">Frontend</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-sky-200 hover:border-sky-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-2xl font-bold text-white">TS</div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">TypeScript</h4>
                  <p className="text-xs text-slate-600">Language</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">Node.js</h4>
                  <p className="text-xs text-slate-600">Runtime</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-2xl font-bold text-white">N</div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">NestJS</h4>
                  <p className="text-xs text-slate-600">Backend</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">PostgreSQL</h4>
                  <p className="text-xs text-slate-600">Database</p>
                </Card>

                <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 border-purple-200 hover:border-purple-300 group">
                  <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="text-2xl font-bold text-white">V</div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">Vite</h4>
                  <p className="text-xs text-slate-600">Build Tool</p>
                </Card>
              </div>
            </div>

            {/* Technical Features */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Seguridad Avanzada</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  JWT, control de roles, autenticación multifactor y auditoría completa de actividades
                </p>
              </div>

              <div className="text-center group">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Alto Rendimiento</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Arquitectura moderna con React Query, caché inteligente y optimizaciones de rendimiento
                </p>
              </div>

              <div className="text-center group">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Escalable y Modular</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Arquitectura microservicios que crece con tu negocio sin límites de usuarios o propiedades
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 text-balance">
                Beneficios que transforman tu negocio
              </h2>
              <p className="text-lg text-slate-600 text-pretty leading-relaxed">
                Optimiza operaciones y mejora la rentabilidad de tu empresa inmobiliaria
              </p>
            </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Clock,
                title: "Optimización de Tiempo",
                desc: "Automatiza tareas repetitivas y enfócate en hacer crecer tu negocio",
              },
              {
                icon: CheckCircle2,
                title: "Reducción de Errores",
                desc: "Minimiza errores humanos con procesos automatizados y validaciones",
              },
              {
                icon: BarChart3,
                title: "Mejor Control Financiero",
                desc: "Visibilidad completa de ingresos, gastos y rentabilidad en tiempo real",
              },
              {
                icon: TrendingUp,
                title: "Escalabilidad del Negocio",
                desc: "Gestiona desde 10 hasta 10,000 propiedades sin cambiar de sistema",
              },
              {
                icon: Shield,
                title: "Centralización de Información",
                desc: "Toda la información en un solo lugar, accesible desde cualquier dispositivo",
              },
              {
                icon: BarChart3,
                title: "Mejora en Decisiones",
                desc: "Toma decisiones informadas con reportes y análisis detallados",
              },
            ].map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 rounded-xl hover:bg-white/80 hover:shadow-lg transition-all duration-300 border border-slate-200">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 text-balance">
              ¿Tienes preguntas? Contáctanos
            </h2>
            <p className="text-lg text-slate-600 text-pretty leading-relaxed">
              Envíanos un mensaje y nuestro equipo te responderá lo antes posible
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="p-6 border-2 border-blue-200 hover:border-blue-300 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email</h3>
                    <p className="text-slate-600">rafaelcorredorgambin1@gmail.com</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Respuesta garantizada en menos de 24 horas
                </p>
              </Card>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">¿Por qué elegirnos?</h3>
                <ul className="space-y-3">
                  {[
                    "Sistema 100% en la nube",
                    "Sin necesidad de instalación",
                    "Soporte técnico 24/7",
                    "Seguridad de datos garantizada",
                    "Actualizaciones automáticas",
                    "Escalable según tu negocio"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-slate-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="p-8 border-2 border-slate-200 hover:border-blue-300 transition-colors duration-300 shadow-lg">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-slate-800">
                    Nombre completo *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-slate-800">
                    Correo electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ejemplo@empresa.com"
                    className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-800">
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="mt-2 border-2 border-slate-200 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-slate-800">
                    Mensaje *
                  </Label>
                  <textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Cuéntanos sobre tu empresa y qué necesitas... (mínimo 10 caracteres)"
                    rows={5}
                    className="mt-2 w-full px-3 py-2 border-2 border-slate-200 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {contactForm.message.length}/1000 caracteres
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar Mensaje
                    </div>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            ¿Listo para transformar tu gestión inmobiliaria?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto text-pretty leading-relaxed">
            Únete a las empresas que ya confían en Arrendando S.A.S para gestionar sus propiedades de manera eficiente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleLogin} size="lg" variant="secondary" className="text-base bg-white text-blue-700 hover:bg-slate-100 font-bold shadow-xl">
              Solicitar Demo Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={handleLogin}
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base font-bold shadow-lg"
            >
              Hablar con Ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-slate-800">Arrendando S.A.S</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sistema de Información Gerencial para gestión inmobiliaria profesional.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Módulos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Actualizaciones
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Acerca de
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Carreras
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Guías
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    Estado
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2025 Arrendando S.A.S. Desarrollado por RunData. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}