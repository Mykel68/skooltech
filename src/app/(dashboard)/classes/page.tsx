"use client";

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

const classList = [
  { name: "Junior Secondary School 1", short: "JSS1", level: "Junior" },
  { name: "Junior Secondary School 2", short: "JSS2", level: "Junior" },
  { name: "Junior Secondary School 3", short: "JSS3", level: "Junior" },
  { name: "Senior Secondary School 1", short: "SS1", level: "Senior" },
  { name: "Senior Secondary School 2", short: "SS2", level: "Senior" },
  { name: "Senior Secondary School 3", short: "SS3", level: "Senior" },
];

const ClassSetupPage = () => {
  const handleCreateClass = (className: string) => {
    // Logic to create the class (e.g., API call)
    console.log(`Creating class: ${className}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Setup</CardTitle>
        <p className="text-muted-foreground text-sm">
          Create classes for Junior and Senior Secondary levels to get started.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classList.map((cls) => (
              <TableRow key={cls.short}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.level}</TableCell>
                <TableCell>
                  <span className="text-yellow-600">Not Created</span>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => handleCreateClass(cls.short)}
                  >
                    Create
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClassSetupPage;
