import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ExistingClassCards({
  fetchedClasses,
}: {
  fetchedClasses: any[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fetchedClasses.map((cls) => (
        <Card
          key={cls.id || cls.grade_level}
          className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-lg"
        >
          <CardHeader className="bg-green-50 p-4 rounded-t-lg">
            <CardTitle className="text-lg font-semibold text-green-700">
              {cls.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 text-gray-700 space-y-2">
            <p>
              <span className="font-semibold">Short Name:</span>{" "}
              <span className="text-gray-900">{cls.short}</span>
            </p>
            <p>
              <span className="font-semibold">Grade Level:</span>{" "}
              <span className="text-gray-900">{cls.grade_level}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
