"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<any>;
  mutation: any;
}

export const CreateSessionDialog = ({
  open,
  setOpen,
  form,
  mutation,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Session</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div>
            <Label>Session Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div>
            <Label>Start Date</Label>
            <Input type="date" {...form.register("start_date")} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" {...form.register("end_date")} />
          </div>
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
