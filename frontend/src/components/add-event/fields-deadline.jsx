"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { useEventForm } from "@/context/event-form-context";

export default function DeadlineFields() {
  const { form } = useEventForm();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <FormLabel className="sm:w-24 text-sm font-medium">
                Priority
              </FormLabel>
              <FormControl>
                <div onPointerDown={(e) => e.stopPropagation()}>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="flex-1 w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
