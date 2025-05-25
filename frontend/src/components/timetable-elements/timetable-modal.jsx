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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function TimetableModal({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [abbreviation, setAbbreviation] = useState("");
  const [instructor, setInstructor] = useState("");
  const [deliveryMode, setDeliveryMode] = useState("");
  const [day, setDay] = useState("");
  const [frequency, setFrequency] = useState("");
  const [seminarInstructor, setSeminarInstructor] = useState("");
  const [seminarDay, setSeminarDay] = useState("");
  const [seminarTime, setSeminarTime] = useState("");
  const [seminarDeliveryMode, setSeminarDeliveryMode] = useState("");
  const [seminarFrequency, setSeminarFrequency] = useState("");
  const [endTime, setEndTime] = useState("");
  const [seminarEndTime, setSeminarEndTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [examDate, setExamDate] = useState("");
  const [seminarDate, setSeminarDate] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [seminarRoom, setSeminarRoom] = useState("");
  const [seminarLink, setSeminarLink] = useState("");
  const [file, setFile] = useState("");

  const isCourseComplete = name && instructor;
  const isSeminarComplete = seminarInstructor && seminarDay && seminarTime;

  const generateAbbreviation = (text) => {
    return text
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!abbreviation) {
      setAbbreviation(generateAbbreviation(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      abbreviation,
      teacherName: instructor,
      deliveryMode,
      day,
      startTime,
      endTime,
      recurrence: frequency,
      examDate: examDate || null, // dacă ai și useState pt asta
      curriculum: "", // înlocuiește cu logica pentru upload curriculum dacă o implementezi
      startDate: new Date().toISOString(), // sau folosește un câmp real

      // doar dacă există valori:
      ...(deliveryMode === "campus" && { roomNumber }),
      ...(deliveryMode === "online" && { meetingLink }),

      ...(seminarInstructor && {
        seminarInstructor,
        seminarDeliveryMode,
        seminarDay,
        seminarTime,
        seminarEndTime,
        seminarFrequency,
        testDate: testDate || null,
        ...(seminarDeliveryMode === "campus" && { seminarRoom }),
        ...(seminarDeliveryMode === "online" && { seminarLink }),
      }),
    };

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      // Opțional: feedback vizual, închide modal, reîncarcă lista
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

        <form className="space-y-6 py-4 px-1 md:px-10">
          <Accordion
            type="single"
            collapsible
            defaultValue="course"
            className="w-full"
          >
            <AccordionItem value="course">
              <AccordionTrigger className="-ml-10">
                <div className="flex items-center gap-2">
                  {isCourseComplete ? (
                    <CheckCircle className="w-5 h-5 text-[#A585FF]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs font-medium">
                      1
                    </div>
                  )}
                  <span>Course Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div>
                    <Label className="mb-1 block">Course Name</Label>
                    <Input value={name} onChange={handleNameChange} required />
                  </div>
                  <div>
                    <Label className="mb-1 block">Abbreviation</Label>
                    <Input
                      value={abbreviation}
                      onChange={(e) => setAbbreviation(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Instructor Name</Label>
                    <Input
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Delivery Mode</Label>
                    <Select
                      value={deliveryMode}
                      onValueChange={setDeliveryMode}
                    >
                      <SelectTrigger>
                        {deliveryMode || "Select location"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Campus">On Campus</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {deliveryMode === "campus" && (
                    <div>
                      <Label className="mb-1 block">Room Number</Label>
                      <Input
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                      />
                    </div>
                  )}
                  {deliveryMode === "online" && (
                    <div>
                      <Label className="mb-1 block">Meeting Link</Label>
                      <Input
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Day</Label>
                      <Select value={day} onValueChange={setDay}>
                        <SelectTrigger>{day || "Select day"}</SelectTrigger>
                        <SelectContent>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1 block">Start Time</Label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1 block">End Time</Label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>

                  {/* Următorul rând: Frequency și ce urmează */}
                  <div>
                    <Label className="mb-1 block">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        {frequency || "Select frequency"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Biweekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Exam Date</Label>
                    <Input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">
                      Curriculum File (optional)
                    </Label>
                    <Input
                      type="file"
                      value={file}
                      onChange={(e) => setFile(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="seminar">
              <AccordionTrigger className="-ml-10">
                <div className="flex items-center gap-2">
                  {isSeminarComplete ? (
                    <CheckCircle className="w-5 h-5 text-[#A585FF]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-xs font-medium">
                      2
                    </div>
                  )}
                  <span>Seminar Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  {/* Rând 1 */}
                  <div>
                    <Label className="mb-1 block">Seminar Instructor</Label>
                    <Input
                      value={seminarInstructor}
                      onChange={(e) => setSeminarInstructor(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block">Seminar Delivery Mode</Label>
                    <Select
                      value={seminarDeliveryMode}
                      onValueChange={setSeminarDeliveryMode}
                    >
                      <SelectTrigger>
                        {seminarDeliveryMode || "Select location"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Campus">On Campus</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Room/Link - doar dacă se aplică */}
                  {seminarDeliveryMode === "campus" && (
                    <div>
                      <Label className="mb-1 block">Seminar Room</Label>
                      <Input
                        value={seminarRoom}
                        onChange={(e) => setSeminarRoom(e.target.value)}
                      />
                    </div>
                  )}
                  {seminarDeliveryMode === "online" && (
                    <div>
                      <Label className="mb-1 block">Seminar Meeting Link</Label>
                      <Input
                        value={seminarLink}
                        onChange={(e) => setSeminarLink(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Rând 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Seminar Day</Label>
                      <Select value={seminarDay} onValueChange={setSeminarDay}>
                        <SelectTrigger>
                          {seminarDay || "Select day"}
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1 block">Start Time</Label>
                      <Input
                        type="time"
                        value={seminarTime}
                        onChange={(e) => setSeminarTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1 block">End Time</Label>
                    <Input
                      type="time"
                      value={seminarEndTime}
                      onChange={(e) => setSeminarEndTime(e.target.value)}
                    />
                  </div>

                  {/* Rând 3 */}
                  <div>
                    <Label className="mb-1 block">Seminar Frequency</Label>
                    <Select
                      value={seminarFrequency}
                      onValueChange={setSeminarFrequency}
                    >
                      <SelectTrigger>
                        {seminarFrequency || "Select frequency"}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Once a week</SelectItem>
                        <SelectItem value="biweekly">
                          Once every two weeks
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block">Test Date</Label>
                    <Input
                      type="date"
                      value={seminarDate}
                      onChange={(e) => setSeminarDate(e.target.value)}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4 flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
