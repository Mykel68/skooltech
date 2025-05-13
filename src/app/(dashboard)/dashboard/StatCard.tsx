import { Card } from "@/components/ui/card";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <Card className="flex flex-col items-start justify-center p-4 gap-2 w-full">
    <div className="text-muted-foreground text-sm flex items-center gap-2">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </Card>
);

export default StatCard;
