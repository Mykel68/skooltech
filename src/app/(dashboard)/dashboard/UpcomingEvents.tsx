import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UpcomingEvents = ({
  events,
}: {
  events: { date: string; title: string }[];
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Events</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      {events.map((event, idx) => (
        <div key={idx} className="flex justify-between">
          <span>{event.title}</span>
          <span className="text-xs text-muted-foreground">{event.date}</span>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default UpcomingEvents;
