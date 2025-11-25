"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { useLogin } from "@/features/auth/basic/query/login"
import { useRecoverPassword } from "@/features/auth/basic/query/recover"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false)
  
  const loginMutation = useLogin()
  const recoverPasswordMutation = useRecoverPassword()
  const isLoading = loginMutation.isPending
  const isRecovering = recoverPasswordMutation.isPending
  const error = loginMutation.error
  const recoverError = recoverPasswordMutation.error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    loginMutation.mutate({
      email,
      password
    })
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    recoverPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setRecoveryEmailSent(true)
        },
        onError: (error) => {
          console.error("Error sending recovery email:", error)
          setRecoveryEmailSent(false)
        }
      }
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Real building background image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
          }}
        ></div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80"></div>
        
        {/* Subtle pattern overlay for texture */}
        <div  
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Crect x='0' y='0' width='20' height='20'/%3E%3Crect x='20' y='20' width='20' height='20'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-lg">
            {/* Building icon */}
            <div className="mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-400/90 to-indigo-500/90 flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  <path d="M7 10h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Gestión Inmobiliaria
              </span>
              <span className="block text-2xl font-light text-blue-200 mt-3 opacity-90">
                Profesional • Moderna • Confiable
              </span>
            </h1>
            
            <p className="text-xl text-blue-100/90 mb-10 leading-relaxed font-light">
              Plataforma integral diseñada para administradores y agentes inmobiliarios que buscan 
              <span className="font-medium text-white"> excelencia tecnológica</span> y 
              <span className="font-medium text-white"> control total</span> de su negocio.
            </p>
            
            <div className="space-y-5">
              <div className="flex items-center text-blue-50 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-lg">Seguridad empresarial de nivel bancario</span>
              </div>
              <div className="flex items-center text-blue-50 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-lg">Analytics en tiempo real y reportes inteligentes</span>
              </div>
              <div className="flex items-center text-blue-50 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-lg">Acceso multiplataforma desde cualquier lugar</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center space-x-6 text-blue-200/80">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Sistema Operativo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">SSL Certificado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Datos Protegidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 lg:w-1/2 items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-blue-50">
        {showForgotPassword ? (
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800"></CardTitle>
            <CardDescription className="text-base text-slate-600">
              No te preocupes, te enviaremos un enlace para recuperarla
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium text-slate-800">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
              
              {recoveryEmailSent && !recoverError && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                  ✅ ¡Correo enviado exitosamente! Revisa tu bandeja de entrada para recuperar tu contraseña.
                </div>
              )}
              
              {recoverError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  ❌ No se pudo enviar el correo. Verifica tu email e intenta nuevamente.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg" 
                disabled={isRecovering}
              >
                {isRecovering ? "Enviando..." : <>Enviar enlace de recuperación <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-slate-600 hover:text-slate-800"
                onClick={() => {
                  setShowForgotPassword(false)
                  setRecoveryEmailSent(false)
                }}
              >
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
        ) : (
          <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 1.54-.14 3-.51 4.35-1.05C17.07 25.64 19 23.61 19 21V7L12 2zm6 19c0 1.93-1.17 3.65-2.93 4.36-1.22.49-2.6.64-4.07.64-1.47 0-2.85-.15-4.07-.64C5.17 24.65 4 22.93 4 21V8.52l8-4.18 8 4.18V21z"/>
                <path d="M8 11h2v6H8zm3 0h2v6h-2zm3 0h2v6h-2z"/>
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-800">Arrendando S.A.S</CardTitle>
            <CardDescription className="text-base text-slate-600">
              Accede a tu panel de gestión inmobiliaria profesional
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-800">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-800">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                 </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  Credenciales incorrectas. Por favor, verifica tu email y contraseña.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl hover:shadow-2xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : <>Iniciar sesión <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>

              <div className="text-center text-sm text-slate-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Sistema seguro y confiable</span>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
      </div>
    </div>
  )
}
