"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "./star-rating"
import { useAuth } from "@/contexts/auth-context"

interface ReviewFormProps {
  productId: string
  onSubmit: (review: {
    rating: number
    title: string
    comment: string
  }) => void
}

export function ReviewForm({ productId, onSubmit }: ReviewFormProps) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({ rating, title, comment })
      // Reset form
      setRating(0)
      setTitle("")
      setComment("")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">You need to be signed in to write a review.</p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-base font-medium">Rating *</Label>
            <div className="mt-2">
              <StarRating rating={rating} interactive onRatingChange={setRating} size="lg" />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Review Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="comment">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000 characters</p>
          </div>

          <Button type="submit" disabled={isSubmitting || rating === 0} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
