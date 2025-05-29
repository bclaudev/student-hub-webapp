// src/components/timetable-elements/timetable-modal.jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { set } from "date-fns";

export default function TimetableModal({
  open,
  onOpenChange,
  initialData = {},
  onSave,
}) {
  console.log("Initial data received:", initialData);
  const [classType, setClassType] = useState(
    initialData.class_type || "course"
  );
  const [name, setName] = useState(initialData.name || "");
  const [abbreviation, setAbbreviation] = useState(
    initialData.abbreviation || ""
  );
  const [teacherName, setTeacherName] = useState(initialData.teacherName || "");
  const [deliveryMode, setDeliveryMode] = useState(
    initialData.deliveryMode || "Campus"
  );
  const [roomNumber, setRoomNumber] = useState(initialData.roomNumber || "");
  const [meetingLink, setMeetingLink] = useState(initialData.meetingLink || "");
  const [day, setDay] = useState(initialData.day || "monday");
  const [startTime, setStartTime] = useState(initialData.startTime || "");
  const [endTime, setEndTime] = useState(initialData.endTime || "");
  const [recurrence, setRecurrence] = useState(
    initialData.recurrence || "once-a-week"
  );
  const [examDate, setExamDate] = useState(
    initialData.examDate ? initialData.examDate.slice(0, 10) : ""
  );
  const [curriculum, setCurriculum] = useState(initialData.curriculum || null);
  const [startDate, setStartDate] = useState(
    initialData.startDate ? initialData.startDate.slice(0, 10) : ""
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditMode = !!initialData.id;

    const payload = {
      class_type: classType,
      name,
      abbreviation,
      teacherName,
      deliveryMode,
      roomNumber: deliveryMode === "Campus" ? roomNumber : undefined,
      meetingLink: deliveryMode === "Online" ? meetingLink : undefined,
      day,
      startTime,
      endTime,
      recurrence,
      examDate: examDate || null,
      ...(typeof curriculum === "string" ? { curriculum } : {}),
      startDate: startDate || new Date().toISOString(),
    };

    console.log("Payload:", payload);

    try {
      const res = await fetch(
        isEditMode ? `/api/classes/${initialData.id}` : "/api/classes",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server responded with error:", res.status, errorText);
        throw new Error("Server error");
      }

      console.log(`Class ${isEditMode ? "updated" : "saved"} successfully`);
      if (onSave) await onSave();
      onOpenChange(false);
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Class Type */}
            <div className="space-y-3">
              <RadioGroup
                value={classType}
                onValueChange={setClassType}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="course" id="course" />
                  <Label htmlFor="course">Course</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="seminar" id="seminar" />
                  <Label htmlFor="seminar">Seminar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="colloquy" id="colloquy" />
                  <Label htmlFor="colloquy">Colloquy</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Name and Abbreviation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter class name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation">Abbreviation</Label>
                <Input
                  id="abbreviation"
                  name="abbreviation"
                  placeholder="e.g., CS101"
                  value={abbreviation}
                  onChange={(e) => setAbbreviation(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Professor */}
            <div className="space-y-2">
              <Label htmlFor="professor">Professor</Label>
              <Input
                id="professor"
                name="professor"
                placeholder="Enter professor name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
            </div>

            {/* Format */}
            <div className="grid grid-cols-[1fr_2fr] gap-6">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select
                  value={deliveryMode}
                  onValueChange={setDeliveryMode}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Campus">On Campus</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deliveryMode === "Campus" && (
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input
                    id="room"
                    placeholder="e.g. 505"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </div>
              )}

              {deliveryMode === "Online" && (
                <div className="space-y-2">
                  <Label htmlFor="link">Meeting Link</Label>
                  <Input
                    id="link"
                    placeholder="https://..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Day and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select id="day" value={day} onValueChange={setDay} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  name="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  name="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Occurrence */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="occurrence">Occurrence</Label>
                <Select
                  id="occurrence"
                  value={recurrence}
                  onValueChange={setRecurrence}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occurrence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once-a-week">Once a week</SelectItem>
                    <SelectItem value="once-every-two-weeks">
                      Once every two weeks
                    </SelectItem>
                    <SelectItem value="once-every-three-weeks">
                      Once every three weeks
                    </SelectItem>
                    <SelectItem value="once-a-month">Once a month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exam Date */}
              <div className="space-y-2">
                <Label htmlFor="exam-date">Exam Date</Label>
                <Input
                  id="exam-date"
                  name="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* Curriculum File Upload */}
            <div className="space-y-2">
              <Label htmlFor="curriculum">Curriculum</Label>
              <Input
                id="curriculum"
                name="curriculum"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCurriculum(e.target.files[0])}
                required
              />
              <p className="text-sm text-muted-foreground">
                Upload curriculum file (PDF, DOC, DOCX)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
