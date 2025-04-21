"use client";

import { SchoolProfileForm } from "@/components/SchoolProfileForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import UserProfileForm from "@/components/UserProfileForm";

export default function ProfileSettingsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>School Profile</CardTitle>
            <CardDescription>
              Update your school's details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SchoolProfileForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
