
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  iconColor?: string;
}

const StatCard = ({ icon: Icon, value, label, iconColor = "text-primary" }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <Icon className={`h-8 w-8 ${iconColor}`} />
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <h3 className="text-sm font-medium text-gray-600">{label}</h3>
  </Card>
);

export default StatCard;
