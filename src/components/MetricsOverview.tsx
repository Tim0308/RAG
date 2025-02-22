import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, AlertCircle, Circle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Types (same as in your app; or you can import them from a shared file)
type Status = {
  date: string;
  status: "Green" | "Amber" | "Red";
  reporter: string;
  comment: string;
};

interface MetricCardProps {
  title: string;
  value: string;
  trend: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

interface MetricsOverviewProps {
  projectName?: string; // optional, if you want to display it
  statuses: Status[];   // the statuses for the selected project
}

const MetricCard = ({ title, value, trend, icon, children }: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="text-rag-green h-4 w-4" />;
      case "down":
        return <TrendingDown className="text-rag-red h-4 w-4" />;
      default:
        return <Minus className="text-rag-amber h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {icon}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <h3 className="text-2xl font-bold">{value}</h3>
            {children}
          </div>
          {getTrendIcon()}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper to convert RAG Status to numeric values
const convertRagStatusToNumber = (status: Status["status"]) => {
  switch (status) {
    case "Green":
      return 1;
    case "Amber":
      return 2;
    case "Red":
      return 3;
    default:
      return 0;
  }
};

// Custom dot component to color each data point by its numeric RAG status
const CustomDot = (props: any) => {
  const { cx, cy, value } = props;
  if (cx === undefined || cy === undefined) return null;

  let fillColor = "#6EE7B7"; // default Green
  if (value === 2) fillColor = "#FCD34D"; // Amber
  if (value === 3) fillColor = "#FCA5A5"; // Red

  return <circle cx={cx} cy={cy} r={6} fill={fillColor} stroke="#fff" strokeWidth={1} />;
};

export const MetricsOverview = ({ projectName, statuses }: MetricsOverviewProps) => {
  // Convert the project statuses into chart-friendly data
  const latestTenRecords = useMemo(() => {
    if (!statuses || !statuses.length) return [];
    
    // Convert statuses to { date: string, status: number }
    const chartData = statuses.map((s) => ({
      date: s.date,
      status: convertRagStatusToNumber(s.status),
    }));

    // Sort by date if needed, then slice the last 10
    return chartData
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
      .slice(-10);
  }, [statuses]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <MetricCard
        title="RAG Status Required"
        value="No"
        trend="neutral"
        icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="RAG Status History"
        value={projectName ? `Project: ${projectName}` : "Improving"}
        trend="up"
        icon={<Circle className="h-4 w-4 text-muted-foreground" />}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={latestTenRecords}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) => {
                const dateObj = new Date(dateStr);
                return dateObj.toLocaleString("default", { month: "short" });
              }}
            />
            <YAxis
              domain={[1, 3]}
              ticks={[1, 2, 3]}
              tickFormatter={(tick) => {
                switch (tick) {
                  case 1:
                    return "Green";
                  case 2:
                    return "Amber";
                  case 3:
                    return "Red";
                  default:
                    return "";
                }
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="status"
              stroke="#8884d8"
              strokeWidth={3}
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </MetricCard>
    </div>
  );
};
