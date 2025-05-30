import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function ClassDetails({
  prefix,
  name,
  setName,
  abbreviation,
  setAbbreviation,
  instructor,
  setInstructor,
  deliveryMode,
  setDeliveryMode,
  roomNumber,
  setRoomNumber,
  meetingLink,
  setMeetingLink,
  day,
  setDay,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  frequency,
  setFrequency,
  dateLabel,
  dateValue,
  setDateValue,
  file,
  setFile,
}) {
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-6">
      {/* Row 1 */}
      <div className="col-span-1">
        <Label className="mb-1 block">{prefix} Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="col-span-1">
        <Label className="mb-1 block">Abbreviation</Label>
        <Input
          value={abbreviation}
          onChange={(e) => setAbbreviation(e.target.value)}
        />
      </div>

      {/* Row 2 — custom 3-column row */}
      <div className="col-span-2 grid grid-cols-[4fr_1.5fr_1.5fr] gap-6">
        <div>
          <Label className="mb-1 block">Professor</Label>
          <Input
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            required
          />
        </div>

        <div>
          <Label className="mb-1 block">Format</Label>
          <Select value={deliveryMode} onValueChange={setDeliveryMode}>
            <SelectTrigger>{deliveryMode || "Select mode"}</SelectTrigger>
            <SelectContent>
              <SelectItem value="Campus">On Campus</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-1 block">Day</Label>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger>{day || "Select day"}</SelectTrigger>
            <SelectContent>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(
                (d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3 */}
      <div>
        <Label className="mb-1 block">Start time</Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <Label className="mb-1 block">End time</Label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      {/* Row 4 */}
      <div>
        <Label className="mb-1 block">Occurence</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>{frequency || "Select frequency"}</SelectTrigger>
          <SelectContent>
            {[
              "Once a week",
              "Once every two weeks",
              "Once every three weeks",
              "Once a month",
            ].map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">{dateLabel}</Label>
        <Input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
        />
      </div>

      {/* Row 5 */}
      <div className="col-span-2">
        <Label className="mb-1 block">Curriculum</Label>
        <Input
          type="file"
          value={file}
          onChange={(e) => setFile(e.target.value)}
        />
      </div>
    </div>
  );
}

export default ClassDetails;
