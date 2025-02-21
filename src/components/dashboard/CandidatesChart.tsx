
import { Card } from "@/components/ui/card";
import { ChartLine } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  date: string;
  candidates: number;
}

interface CandidatesChartProps {
  data: ChartData[];
}

const CandidatesChart = ({ data }: CandidatesChartProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Candidatures reçues</h2>
      <ChartLine className="h-5 w-5 text-gray-500" />
    </div>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="candidates" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="candidates"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#candidates)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default CandidatesChart;
