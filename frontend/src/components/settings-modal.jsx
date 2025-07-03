"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Globe,
  Lock,
  Palette,
  Settings,
  User,
  Volume2,
  Zap,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useUser } from "@/hooks/use-user.jsx";
import { toast } from "sonner";

const settingsTabs = [
  { id: "general", label: "General", icon: User },
  { id: "timetable", label: "Timetable", icon: Bell },
  { id: "calendar", label: "Calendar", icon: Settings },
];

function SettingsContent({ activeTab }) {
  const tab = settingsTabs.find((t) => t.id === activeTab);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailCurrent, setEmailCurrent] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, setUser } = useUser();
  const [startWeekOnMonday, setStartWeekOnMonday] = useState(
    user?.startWeekOnMonday ?? false
  );
  const [calendarWeekStartOnMonday, setCalendarWeekStartOnMonday] = useState(
    user?.calendarWeekStartOnMonday ?? false
  );

  useEffect(() => {
    if (user?.startWeekOnMonday !== undefined) {
      setStartWeekOnMonday(user.startWeekOnMonday);
    }
  }, [user?.startWeekOnMonday]);

  useEffect(() => {
    if (user?.calendarWeekStartOnMonday !== undefined) {
      setCalendarWeekStartOnMonday(user.calendarWeekStartOnMonday);
    }
  }, [user]);

  const handleNameSave = async () => {
    const res = await fetch("/api/user/name", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Updated user from backend:", data.user);

      setUser(data.user);
      toast.success("Name updated!");
    } else {
      const error = await res.text();
      toast.error("Error: " + error);
    }
  };

  const handleEmailSave = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await fetch("/api/user/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentEmail: emailCurrent,
        newEmail: emailNew,
        password,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      toast.success("Email updated!");
    } else {
      const error = await res.text();
      alert("Error: " + error);
    }
  };

  if (activeTab === "general") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            General
          </h2>
          <p className="text-foreground">
            Manage general settings for your account and application.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  placeholder="Last name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <Button variant="secondary" size="sm" onClick={handleNameSave}>
                  Save
                </Button>
              </div>
            </div>
            <CardTitle className="py-2">Change your email address</CardTitle>
            <div className="space-y-2">
              <Label htmlFor="email">Current email address</Label>
              <Input
                id="email"
                value={emailCurrent}
                placeholder="Email"
                onChange={(e) => setEmailCurrent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">New email address</Label>
              <Input
                id="emailNew"
                value={emailNew}
                placeholder="New email"
                onChange={(e) => setEmailNew(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  placeholder="Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="pt-2">
              <Button variant="secondary" size="sm" onClick={handleEmailSave}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === "timetable") {
    const handleToggle = async (value) => {
      setStartWeekOnMonday(value);

      const res = await fetch("/api/user/settings/timetable", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startWeekOnMonday: value }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("🧠 Updated user from server:", data.user); // << aici vezi dacă vine startWeekOnMonday

        setUser(data.user);
        toast.success("Timetable setting updated");
      } else {
        toast.error("Couldn't update setting");
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Timetable
          </h2>
          <p className="text-foreground">
            Customize how your week is displayed.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Timetable Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="startWeek">Start week on Monday</Label>
              <Switch
                id="startWeek"
                checked={startWeekOnMonday}
                onCheckedChange={async (value) => {
                  setStartWeekOnMonday(value);

                  const res = await fetch("/api/user/settings/timetable", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startWeekOnMonday: value }),
                  });

                  if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    toast.success("Timetable setting updated");
                  } else {
                    toast.error("Couldn't update setting");
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeTab === "calendar") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            Calendar
          </h2>
          <p className="text-foreground">
            Choose how you prefer your calendar view.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calendar Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="calendarWeekStart">Start week on Monday</Label>
              <Switch
                id="calendarWeekStart"
                checked={calendarWeekStartOnMonday}
                onCheckedChange={async (value) => {
                  setCalendarWeekStartOnMonday(value);

                  const res = await fetch("/api/user/settings/calendar", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ calendarWeekStartOnMonday: value }),
                  });

                  if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    toast.success("Calendar setting updated");
                  } else {
                    toast.error("Couldn't update setting");
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-foreground">
          {tab?.label}
        </h2>
        <p className="text-foreground">
          Settings for {tab?.label.toLowerCase()}.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <p className="text-foreground">
            Settings content for {activeTab} coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-[95vw] lg:max-w-[1400px] max-h-[95vh] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        </div>

        <div className="flex h-[700px]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
            <div className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors text-foreground ${
                      activeTab === tab.id
                        ? "bg-primary text-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <SettingsContent activeTab={activeTab} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
