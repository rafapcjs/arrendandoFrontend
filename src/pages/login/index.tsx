"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {showForgotPassword ? (
        <Card className="w-full max-w-md shadow-xl border-2">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
              <Mail className="w-6 h-6 text-secondary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription className="text-base">
              No te preocupes, te enviaremos un enlace para recuperarla
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-sm font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-muted/50 border-2 focus:bg-card"
                  />
                </div>
              </div>
              
              {recoveryEmailSent && !recoverError && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                  ✅ ¡Correo enviado exitosamente! Revisa tu bandeja de entrada para recuperar tu contraseña.
                </div>
              )}
              
              {recoverError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  ❌ No se pudo enviar el correo. Verifica tu email e intenta nuevamente.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isRecovering}>
                {isRecovering ? "Enviando..." : <>Enviar enlace de recuperación <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
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
        <Card className="w-full max-w-md shadow-xl border-2">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">¡Bienvenido de nuevo!</CardTitle>
            <CardDescription className="text-base">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 bg-muted/50 border-2 focus:bg-card transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-12 bg-muted/50 border-2 focus:bg-card transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                  Credenciales incorrectas. Por favor, verifica tu email y contraseña.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : <>Iniciar sesión <ArrowRight className="ml-2 w-5 h-5" /></>}
              </Button>

             
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
