"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const classList = [
  { name: "Junior Secondary School 1", short: "JSS1", grade_level: "Junior" },
  { name: "Junior Secondary School 2", short: "JSS2", grade_level: "Junior" },
  { name: "Junior Secondary School 3", short: "JSS3", grade_level: "Junior" },
  { name: "Senior Secondary School 1", short: "SS1", grade_level: "Senior" },
  { name: "Senior Secondary School 2", short: "SS2", grade_level: "Senior" },
  { name: "Senior Secondary School 3", short: "SS3", grade_level: "Senior" },
];

const ClassSetupPage = () => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const toggleSelection = (short: string) => {
    setSelectedClasses((prev) =>
      prev.includes(short)
        ? prev.filter((item) => item !== short)
        : [...prev, short]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClasses(classList.map((cls) => cls.short));
    } else {
      setSelectedClasses([]);
    }
  };

  const handleCreateSelected = () => {
    if (selectedClasses.length === 0) return alert("No class selected");
    console.log("Creating classes:", selectedClasses);
    // TODO: Replace with API call
  };

  useEffect(() => {
    const isAllSelected = selectedClasses.length === classList.length;
    const isNoneSelected = selectedClasses.length === 0;

    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = !isAllSelected && !isNoneSelected;
    }
  }, [selectedClasses]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Setup</CardTitle>
        <p className="text-muted-foreground text-sm">
          Select classes to create and click the button below.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  ref={selectAllRef}
                  checked={selectedClasses.length === classList.length}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                />
              </TableHead>
              <TableHead>Class Name</TableHead>
              <TableHead>Short Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classList.map((cls) => (
              <TableRow key={cls.short}>
                <TableCell>
                  <Checkbox
                    checked={selectedClasses.includes(cls.short)}
                    onCheckedChange={() => toggleSelection(cls.short)}
                  />
                </TableCell>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.short}</TableCell>
                <TableCell>{cls.grade_level}</TableCell>
                <TableCell>
                  <span className="text-yellow-600">Not Created</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-4">
          <Button onClick={handleCreateSelected}>Create Selected</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassSetupPage;
