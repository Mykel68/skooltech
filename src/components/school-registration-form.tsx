"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Upload } from "lucide-react"

export default function SchoolRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    admin_username: "",
    admin_password: "",
    admin_email: "",
    admin_first_name: "",
    admin_last_name: "",
    school_image: "",
    phone_number: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
          setFormData((prev) => ({ ...prev, school_image: file.name }))
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to your API
    alert("School registration submitted successfully!")
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">School Registration</CardTitle>
          <CardDescription>Register your school information and create an administrator account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* School Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">School Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter school name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">School Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter school address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_image">School Logo/Image</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("school_image")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <Input
                  id="school_image"
                  name="school_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="h-16 w-16 rounded-md overflow-hidden border">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="School preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Administrator Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Administrator Account</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin_first_name">First Name</Label>
                <Input
                  id="admin_first_name"
                  name="admin_first_name"
                  value={formData.admin_first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_last_name">Last Name</Label>
                <Input
                  id="admin_last_name"
                  name="admin_last_name"
                  value={formData.admin_last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_email">Email</Label>
              <Input
                id="admin_email"
                name="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={handleChange}
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_username">Username</Label>
              <Input
                id="admin_username"
                name="admin_username"
                value={formData.admin_username}
                onChange={handleChange}
                placeholder="Create a username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_password">Password</Label>
              <div className="relative">
                <Input
                  id="admin_password"
                  name="admin_password"
                  type={showPassword ? "text" : "password"}
                  value={formData.admin_password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full">
            Register School
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
