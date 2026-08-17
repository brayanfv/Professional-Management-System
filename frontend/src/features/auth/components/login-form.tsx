"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  AuthLoadingScreen,
  AuthSessionErrorScreen,
} from "@/components/common/auth-loading-screen"
import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"
import { PasswordInput } from "@/components/common/password-input"
import { Brand } from "@/components/layout/brand"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ApiClientError } from "@/lib/api/client"
import { routes } from "@/lib/routes"
import { useAuth } from "@/providers/auth-provider"

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

type LoginFormValues = z.infer<typeof loginSchema>

function getLoginErrorMessage(error: unknown) {
  if (
    error instanceof ApiClientError &&
    error.details.code === "INVALID_CREDENTIALS"
  ) {
    return "Invalid email or password."
  }

  return "Unable to sign in right now. Please try again."
}

export function LoginForm() {
  const router = useRouter()
  const { retrySession, signIn, status } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(routes.dashboard)
    }
  }, [router, status])

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)

    try {
      await signIn(values)
      router.replace(routes.dashboard)
    } catch (error) {
      setFormError(getLoginErrorMessage(error))
    }
  }

  if (status === "restore-error") {
    return <AuthSessionErrorScreen onRetry={retrySession} />
  }

  if (status !== "unauthenticated") {
    return <AuthLoadingScreen />
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-[27.5rem] space-y-6">
        <Brand className="justify-center" />
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to continue to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              {formError && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-sm text-danger-foreground"
                >
                  {formError}
                </div>
              )}

              <FormField invalid={Boolean(errors.email)}>
                <FormLabel htmlFor="email" required>
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <FormMessage id="email-error">
                  {errors.email?.message}
                </FormMessage>
              </FormField>

              <FormField invalid={Boolean(errors.password)}>
                <FormLabel htmlFor="password" required>
                  Password
                </FormLabel>
                <PasswordInput
                  id="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <FormMessage id="password-error">
                  {errors.password?.message}
                </FormMessage>
              </FormField>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && (
                  <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
                )}
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
