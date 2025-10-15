import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatusCountResponse, OwnerCountResponse } from '../api/types';

interface StatusChartProps {
  data: StatusCountResponse[];
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  // colors map reserved for future legend usage
  // const colors = {
  //   'Open': '#3b82f6',
  //   'In Progress': '#f59e0b',
  //   'Review': '#8b5cf6',
  //   'On Hold': '#6b7280',
  //   'Blocked': '#ef4444',
  //   'Done': '#10b981',
  // };

  return (
    <div className="card transition-all duration-300 hover:shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">توزیع وضعیت تسک‌ها</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" />
          <YAxis dataKey="status" type="category" width={100} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '0.5rem',
              color: '#e2e8f0'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            fill="#3b82f6" 
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface OwnerChartProps {
  data: OwnerCountResponse[];
}

export const OwnerChart: React.FC<OwnerChartProps> = ({ data }) => {
  const topOwners = data.slice(0, 5); // Top 5 owners
  
  return (
    <div className="card transition-all duration-300 hover:shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">تسک‌های برتر مالکان</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={topOwners} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" />
          <YAxis dataKey="owner" type="category" width={120} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '0.5rem',
              color: '#e2e8f0'
            }}
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            fill="#10b981" 
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface StatusPieChartProps {
  data: StatusCountResponse[];
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data }) => {
  const colors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#6b7280', '#ef4444', '#10b981'];
  
  return (
    <div className="card transition-all duration-300 hover:shadow-xl">
      <h3 className="text-lg font-semibold mb-4 text-slate-100">نمودار دایره‌ای وضعیت‌ها</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, count }) => `${status}: ${count}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            animationDuration={800}
            animationBegin={0}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                style={{ 
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.95)', 
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '0.5rem',
              color: '#e2e8f0'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
