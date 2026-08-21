"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  AuthLoadingScreen,
  AuthSessionErrorScreen,
} from "@/components/common/auth-loading-screen"
import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"
import { PasswordInput } from "@/components/common/password-input"
import { Brand } from "@/components/layout/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoginHero } from "@/features/auth/components/login-hero"
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/login-schema"
import { ApiClientError } from "@/lib/api/client"
import { routes } from "@/lib/routes"
import { useAuth } from "@/providers/auth-provider"

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
    <main className="min-h-dvh bg-background lg:grid lg:h-dvh lg:min-h-[42rem] lg:grid-cols-[42%_58%]">
      <LoginHero />

      <section
        className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:h-full lg:min-h-0 lg:px-12 lg:py-8 xl:px-20"
        aria-labelledby="login-title"
      >
        <div className="w-full max-w-[28rem]">
          <Brand className="mb-10 lg:hidden" />

          <header className="space-y-2">
            <h1
              id="login-title"
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Welcome back
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Sign in to access your Professional Management workspace.
            </p>
          </header>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-5"
          >
            {formError && (
              <div
                role="alert"
                aria-live="polite"
                className="flex items-start gap-2.5 rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-sm text-danger-foreground"
              >
                <CircleAlertIcon
                  className="mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <span>{formError}</span>
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
                placeholder="Enter your email"
                className="h-11"
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
                placeholder="Enter your password"
                className="h-11"
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
              size="lg"
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
        </div>
      </section>
    </main>
  )
}
