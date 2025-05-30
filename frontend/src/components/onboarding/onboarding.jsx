"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, GraduationCap, Clock, Target } from "lucide-react";
import { format } from "date-fns";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [semesterStart, setSemesterStart] = useState();
  const [semesterEnd, setSemesterEnd] = useState();

  const totalSteps = 3;

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const res = await fetch("http://localhost:8787/api/semesters/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          startDate: semesterStart?.toISOString().split("T")[0],
          endDate: semesterEnd?.toISOString().split("T")[0],
        }),
      });

      if (res.ok) {
        window.location.href = "/calendar";
      } else {
        alert("Eroare la salvarea semestrului");
      }
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return semesterStart !== undefined;
    if (currentStep === 3)
      return semesterEnd && semesterStart && semesterEnd > semesterStart;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex flex-col justify-between text-primary-foreground">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="w-2 h-2 bg-white rounded-full" />
            <span className="font-semibold text-lg">student•hub</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Organize your academic journey with ease.
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Our platform is designed for students of all levels. Track
              assignments, manage schedules, and achieve your academic goals
              with intelligent planning tools.
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                step <= currentStep ? "bg-white w-8" : "bg-primary/30 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-1/2 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-right mb-8">
            <span className="text-sm text-muted-foreground">
              {currentStep}/3
            </span>
          </div>

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Welcome to your setup
                </h2>
                <p className="text-muted-foreground">
                  Let's get your academic schedule configured so we can provide
                  you with the best experience.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="border-2 border-primary bg-primary/10 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Student
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Set up your academic schedule
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border cursor-pointer hover:border-muted transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Target className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Educator
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Manage courses and students
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  When does your semester start?
                </h2>
                <p className="text-muted-foreground">
                  This helps us understand your academic timeline and provide
                  relevant scheduling features.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    Semester start date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-14 border-2 ${
                          semesterStart
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        } ${!semesterStart && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {semesterStart
                          ? format(semesterStart, "EEEE, MMMM do, yyyy")
                          : "Select your start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="z-50 w-auto bg-popover p-4 border border-border">
                      <Calendar
                        mode="single"
                        selected={semesterStart}
                        onSelect={setSemesterStart}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {semesterStart && (
                  <Card className="bg-primary/10 border border-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-primary">
                            Great choice!
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Your semester starts on{" "}
                            {format(semesterStart, "MMMM do, yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  When does your semester end?
                </h2>
                <p className="text-muted-foreground">
                  This completes your academic timeline setup and helps us plan
                  your entire semester journey.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">
                    Semester end date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal h-14 border-2 ${
                          semesterEnd
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        } ${!semesterEnd && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {semesterEnd
                          ? format(semesterEnd, "EEEE, MMMM do, yyyy")
                          : "Select your end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={semesterEnd}
                        onSelect={setSemesterEnd}
                        disabled={(date) =>
                          semesterStart ? date <= semesterStart : false
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {semesterEnd &&
                  semesterStart &&
                  semesterEnd > semesterStart && (
                    <Card className="bg-primary/10 border border-primary/40">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <p className="font-medium text-primary">
                            Perfect! Your semester is all set.
                          </p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              Duration:{" "}
                              {Math.ceil(
                                (semesterEnd.getTime() -
                                  semesterStart.getTime()) /
                                  (1000 * 60 * 60 * 24 * 7)
                              )}{" "}
                              weeks
                            </p>
                            <p>
                              From {format(semesterStart, "MMM do")} to{" "}
                              {format(semesterEnd, "MMM do, yyyy")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {semesterEnd &&
                  semesterStart &&
                  semesterEnd <= semesterStart && (
                    <Card className="bg-destructive/10 border border-destructive">
                      <CardContent className="p-4">
                        <p className="text-destructive font-medium">
                          Please select an end date that's after your start
                          date.
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </div>
          )}

          {/* Next Step Button */}
          <div className="mt-12">
            <Button
              onClick={handleNext}
              disabled={!canContinue()}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg"
            >
              {currentStep === totalSteps ? "Complete Setup" : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
