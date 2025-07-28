import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityFeed = ({ items }: { items: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      {items.map((item, idx) => (
        <div key={idx}>• {item}</div>
      ))}
    </CardContent>
  </Card>
);

export default ActivityFeed;
