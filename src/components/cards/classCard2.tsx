import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ClassCardProps = {
  name: string;
  short: string;
  grade_level: string;
};

export default function ClassCard({
  name,
  short,
  grade_level,
}: ClassCardProps) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg">
      <CardHeader className="bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-blue-700">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 text-gray-700 space-y-2">
        <p>
          <span className="font-semibold">Short Name:</span>{" "}
          <span className="text-gray-900">{short}</span>
        </p>
        <p>
          <span className="font-semibold">Grade Level:</span>{" "}
          <span className="text-gray-900">{grade_level}</span>
        </p>
      </CardContent>
    </Card>
  );
}
