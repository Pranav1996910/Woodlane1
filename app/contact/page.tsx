"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Assuming this component is now defined
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Phone, MapPin } from "lucide-react" // Added icons

export default function ContactFormPage() {
  // --- Replace these with your actual company contact details ---
  const companyInfo = {
    phone: "+91 08147478341",
    email: "woodlanedoors@gmail.com",
    address: "285 4th cross Health Layout Annapoorneshwari nagar, 2nd Stage, Naagarabhaavi, Bengaluru, Karnataka 560091",
  };
  // -----------------------------------------------------------

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // ... (inside ContactFormPage component)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmissionStatus('idle')

    try {
      // Step 1: Send form data to your API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // If the API route returns an error status (e.g., 500)
        throw new Error('Failed to send email via API.');
      }

      // Success
      setSubmissionStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })

    } catch (error) {
      console.error("Submission Error:", error)
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section/Header */}
      <div
        className="relative h-48 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/contact-us-background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              ←
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white text-balance">Get In Touch</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Contact Information Card (Left Side) */}
          <Card className="lg:w-1/3 shadow-xl bg-card/80 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Our Contact Information</CardTitle>
              <p className="text-sm text-muted-foreground">We are here to help you quickly.</p>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Phone Number */}
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Call Us</h4>
                  <a href={`tel:${companyInfo.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {companyInfo.phone}
                  </a>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Email Support</h4>
                  <a href={`mailto:${companyInfo.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Visit Us</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {companyInfo.address}
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Contact Form Card (Right Side) */}
          <Card className="lg:w-2/3 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send Us a Message</CardTitle>
              <p className="text-sm text-muted-foreground">Fill out the form for general inquiries.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+91 ..." value={formData.phone} onChange={handleChange} required />
                </div>
                {/* Subject Field */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Inquiry about..." value={formData.subject} onChange={handleChange} required />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here." rows={5} value={formData.message} onChange={handleChange} required />
                </div>

                {/* Submission Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>

                {/* Submission Status Feedback */}
                {submissionStatus === 'success' && (
                  <div className="text-center p-3 text-green-600 bg-green-50 rounded-md border border-green-200">
                    ✅ Thank you! Your message has been sent successfully.
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="text-center p-3 text-red-600 bg-red-50 rounded-md border border-red-200">
                    ❌ Error: Failed to send your message. Please try again later.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}