import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FileUploader } from "./file-uploader";

export default function UploadModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="px-4 text-foreground">
          Upload
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <h2 className="text-lg font-semibold">Upload file</h2>
        <FileUploader onUploadSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
