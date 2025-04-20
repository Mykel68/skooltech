"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const skillOptions = [
  "Design",
  "Communication",
  "Content writing",
  "Creative writing",
  "Problem-solving",
  "Leadership",
  "Teamwork",
  "First Aid",
  "Teaching",
  "Fundraising",
];

const volunteerRoles = [
  "Community outreach",
  "Education support",
  "Healthcare assistance",
  "Administrative support",
  "Event coordination",
  "Fundraising",
  "Social media",
  "Construction",
  "Environmental projects",
];

export default function VolunteerRegistrationForm() {
  const [selectedSkills, setSelectedSkills] = useState([
    "Design",
    "Communication",
    "Content writing",
    "Creative writing",
    "Problem-solving",
  ]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date("2023-06-16")
  );
  const [birthDate, setBirthDate] = useState<Date | undefined>();

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Register your information</h1>
        <p className="text-muted-foreground">
          By registering, you will be able to join our team!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" placeholder="Full name" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" placeholder="Phone number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="Email address" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Address" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input id="education" placeholder="Education" />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Emergency Contact */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Emergency Contact</h2>

            <div className="space-y-2">
              <Label htmlFor="emergencyName">Full name</Label>
              <Input id="emergencyName" placeholder="Full name" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone number</Label>
                <Input id="emergencyPhone" placeholder="Phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relation">Relation</Label>
                <Input id="relation" placeholder="Relation" />
              </div>
            </div>
          </div>

          {/* Volunteer Roles/Interests */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Volunteer Roles/Interests</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an area" />
              </SelectTrigger>
              <SelectContent>
                {volunteerRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date of birth */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Date of birth</h2>
            <div className="grid grid-cols-3 gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {format(new Date(2000, i, 1), "MMMM")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <SelectItem key={i} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Gender</h2>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Start Date?</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate
                    ? format(startDate, "MM/dd/yyyy")
                    : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Skill Tags */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Skill Tags</h2>
        <div className="flex flex-wrap gap-2">
          {skillOptions.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className={cn(
                "cursor-pointer hover:bg-primary/90",
                selectedSkills.includes(skill)
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              )}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full mt-8 py-6 text-lg bg-green-500 hover:bg-green-600"
      >
        Submit
      </Button>
    </form>
  );
}
