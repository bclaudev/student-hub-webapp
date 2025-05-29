import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TimetablePreviewModal({ open, onOpenChange, data }) {
  if (!data) return null;

  const color = data.color || "#a585ff";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl p-0 overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="p-6 text-[#0d0d0d] dark:text-[#eaeaea]">
          <DialogHeader>
            <DialogTitle className="text-[#0d0d0d] dark:text-[#eaeaea]">
              {data.abbreviation} — {data.name}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-2 text-sm">
            <div>
              <strong>Professor:</strong> {data.teacherName}
            </div>

            <div>
              <strong>Format:</strong> {data.deliveryMode}
              {data.deliveryMode === "Campus" && `, Room ${data.roomNumber}`}
              {data.deliveryMode === "Online" && `, ${data.meetingLink}`}
            </div>

            <div>
              <strong>Day:</strong> {data.day}, <strong>Time:</strong>{" "}
              {data.startTime} – {data.endTime}
            </div>

            <div>
              <strong>Recurrence:</strong> {data.recurrence}
            </div>

            <div>
              <strong>Start date:</strong> {data.startDate?.slice(0, 10) || "-"}
            </div>

            <div>
              <strong>Exam date:</strong> {data.examDate?.slice(0, 10) || "-"}
            </div>

            {typeof data.curriculum === "string" && data.curriculum && (
              <div>
                <strong>Curriculum:</strong> {data.curriculum}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
