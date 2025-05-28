// src/components/timetable-elements/timetable-modal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ClassDetails from "./class-details";

export default function TimetableModal({ open, onOpenChange }) {
  // General state
  const [classType, setClassType] = useState("course");
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState("");
  const [examDate, setExamDate] = useState("");
  const [file, setFile] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  // Seminar state
  const [seminarInstructor, setSeminarInstructor] = useState("");
  const [seminarDeliveryMode, setSeminarDeliveryMode] = useState("");
  const [seminarDay, setSeminarDay] = useState("");
  const [seminarTime, setSeminarTime] = useState("");
  const [seminarEndTime, setSeminarEndTime] = useState("");
  const [seminarFrequency, setSeminarFrequency] = useState("");
  const [seminarDate, setSeminarDate] = useState("");
  const [seminarRoom, setSeminarRoom] = useState("");
  const [seminarLink, setSeminarLink] = useState("");

  // Colloquy state
  const [colloquyInstructor, setColloquyInstructor] = useState("");
  const [colloquyDay, setColloquyDay] = useState("");
  const [colloquyTime, setColloquyTime] = useState("");
  const [colloquyRoom, setColloquyRoom] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      classType,
      name,
      abbreviation,
      teacherName: instructor,
      deliveryMode,
      day,
      startTime,
      endTime,
      recurrence: frequency,
      examDate: examDate ? new Date(examDate) : null,
      curriculum: "", // if you implement file upload handling, replace this
      startDate: new Date(),

      // Course-specific extras
      ...(deliveryMode === "Campus" && { roomNumber }),
      ...(deliveryMode === "Online" && { meetingLink }),

      // Seminar-specific extras
      ...(seminarInstructor && {
        seminarInstructor,
        seminarDeliveryMode,
        seminarDay,
        seminarTime,
        seminarEndTime,
        seminarFrequency,
        testDate: seminarDate ? new Date(seminarDate) : null,
        ...(seminarDeliveryMode === "Campus" && { seminarRoom }),
        ...(seminarDeliveryMode === "Online" && { seminarLink }),
      }),

      // Colloquy-specific extras
      ...(classType === "colloquy" && {
        colloquyInstructor,
        colloquyDay,
        colloquyTime,
        colloquyRoom,
      }),
    };

    console.log("Payload:", payload);

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server responded with error:", res.status, errorText);
        throw new Error("Server error");
      }

      console.log("Class saved successfully");
      onOpenChange(false);
    } catch (err) {
      console.error("Error saving class:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto pt-6">
        <div className="sticky top-0 z-40 border-b border-border px-1 md:px-10 pt-4 pb-2">
          <DialogHeader className="md:-ml-10">
            <DialogTitle className="text-left">Add New Class</DialogTitle>
          </DialogHeader>
        </div>

        <form className="space-y-6 py-4 px-1 md:px-10" onSubmit={handleSubmit}>
          {/* Class Type Selector */}
          <div className="flex items-center gap-6">
            {["course", "seminar", "colloquy"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="classType"
                  value={type}
                  checked={classType === type}
                  onChange={() => setClassType(type)}
                  className="radio"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Course Details */}
          {["course", "seminar", "colloquy"].includes(classType) && (
            <ClassDetails
              prefix={classType.charAt(0).toUpperCase() + classType.slice(1)}
              name={
                classType === "course"
                  ? name
                  : classType === "seminar"
                  ? seminarInstructor
                  : colloquyInstructor
              }
              setName={
                classType === "course"
                  ? setName
                  : classType === "seminar"
                  ? setSeminarInstructor
                  : setColloquyInstructor
              }
              abbreviation={abbreviation}
              setAbbreviation={setAbbreviation}
              instructor={
                classType === "course"
                  ? instructor
                  : classType === "seminar"
                  ? seminarInstructor
                  : colloquyInstructor
              }
              setInstructor={
                classType === "course"
                  ? setInstructor
                  : classType === "seminar"
                  ? setSeminarInstructor
                  : setColloquyInstructor
              }
              deliveryMode={
                classType === "course" ? deliveryMode : seminarDeliveryMode
              }
              setDeliveryMode={
                classType === "course"
                  ? setDeliveryMode
                  : setSeminarDeliveryMode
              }
              roomNumber={classType === "course" ? roomNumber : seminarRoom}
              setRoomNumber={
                classType === "course" ? setRoomNumber : setSeminarRoom
              }
              meetingLink={classType === "course" ? meetingLink : seminarLink}
              setMeetingLink={
                classType === "course" ? setMeetingLink : setSeminarLink
              }
              day={
                classType === "course"
                  ? day
                  : classType === "seminar"
                  ? seminarDay
                  : colloquyDay
              }
              setDay={
                classType === "course"
                  ? setDay
                  : classType === "seminar"
                  ? setSeminarDay
                  : setColloquyDay
              }
              startTime={
                classType === "course"
                  ? startTime
                  : classType === "seminar"
                  ? seminarTime
                  : colloquyTime
              }
              setStartTime={
                classType === "course"
                  ? setStartTime
                  : classType === "seminar"
                  ? setSeminarTime
                  : setColloquyTime
              }
              endTime={
                classType === "course"
                  ? endTime
                  : classType === "seminar"
                  ? seminarEndTime
                  : ""
              }
              setEndTime={
                classType === "course"
                  ? setEndTime
                  : classType === "seminar"
                  ? setSeminarEndTime
                  : () => {}
              }
              frequency={classType === "course" ? frequency : seminarFrequency}
              setFrequency={
                classType === "course" ? setFrequency : setSeminarFrequency
              }
              dateLabel={
                classType === "seminar"
                  ? "Test Date"
                  : classType === "colloquy"
                  ? "Date"
                  : "Exam Date"
              }
              dateValue={classType === "course" ? examDate : seminarDate}
              setDateValue={
                classType === "course" ? setExamDate : setSeminarDate
              }
              file={file}
              setFile={setFile}
            />
          )}
          <div className="pt-4 flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
