import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function SalesChart({ data, title = "Life Time Sales" }) {
  // Sample data if none provided
  const chartData = data || [
    { month: '1', sales: 400, revenue: 240, commission: 100 },
    { month: '2', sales: 300, revenue: 139, commission: 80 },
    { month: '3', sales: 500, revenue: 980, commission: 200 },
    { month: '4', sales: 278, revenue: 390, commission: 150 },
    { month: '5', sales: 589, revenue: 480, commission: 250 },
    { month: '6', sales: 639, revenue: 380, commission: 280 },
    { month: '7', sales: 749, revenue: 430, commission: 320 },
    { month: '8', sales: 849, revenue: 530, commission: 360 },
    { month: '9', sales: 889, revenue: 630, commission: 380 },
    { month: '10', sales: 929, revenue: 730, commission: 400 },
    { month: '11', sales: 969, revenue: 830, commission: 420 },
    { month: '12', sales: 1009, revenue: 930, commission: 450 },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="sales" stroke="#8884d8" fillOpacity={1} fill="url(#colorSales)" />
          <Area type="monotone" dataKey="revenue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorRevenue)" />
          <Area type="monotone" dataKey="commission" stroke="#ffc658" fillOpacity={1} fill="url(#colorCommission)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
