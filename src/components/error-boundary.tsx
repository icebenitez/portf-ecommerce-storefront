"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-destructive">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                We encountered an error while loading this page. Please try refreshing or go back to the homepage.
              </p>
              <div className="space-y-2">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
