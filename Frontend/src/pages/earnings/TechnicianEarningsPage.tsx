import { useEffect } from 'react';
import { useAuth, useApi } from '@/hooks';
import { ReservationService } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { ReservationStatus } from '@/types';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const TechnicianEarningsPage: React.FC = () => {
  const { user } = useAuth();

  const { data: allReservations, loading, execute: fetchReservations } = useApi(
    () => ReservationService.getAll(0, 1000)
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  const reservations = allReservations?.content ?? [];

  const myCompletedReservations = reservations.filter(
    r =>
      r?.technician?.id === user?.id &&
      r.status === ReservationStatus.COMPLETED
  );

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const yearStart = startOfYear(now);
  const yearEnd = endOfYear(now);

  const monthReservations = myCompletedReservations.filter(r => {
    const date = new Date(r.serviceDate);
    return date >= monthStart && date <= monthEnd;
  });

  const yearReservations = myCompletedReservations.filter(r => {
    const date = new Date(r.serviceDate);
    return date >= yearStart && date <= yearEnd;
  });

  const totalEarnings = myCompletedReservations.reduce(
    (sum, r) => sum + (r.finalPrice ?? 0),
    0
  );
  const monthlyEarnings = monthReservations.reduce((sum, r) => sum + (r.finalPrice ?? 0), 0);
  const yearlyEarnings = yearReservations.reduce((sum, r) => sum + (r.finalPrice ?? 0), 0);

  const averagePerJob = myCompletedReservations.length > 0
    ? totalEarnings / myCompletedReservations.length
    : 0;

  const stats = [
    {
      title: 'This Month',
      value: `S/ ${monthlyEarnings.toFixed(2)}`,
      icon: Calendar,
      color: 'text-blue-500',
      jobs: monthReservations.length,
    },
    {
      title: 'This Year',
      value: `S/ ${yearlyEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-green-500',
      jobs: yearReservations.length,
    },
    {
      title: 'Total Earnings',
      value: `S/ ${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-500',
      jobs: myCompletedReservations.length,
    },
    {
      title: 'Average per Job',
      value: `S/ ${averagePerJob.toFixed(2)}`,
      icon: CheckCircle,
      color: 'text-yellow-500',
      jobs: myCompletedReservations.length,
    },
  ];

  // Agrupar por mes
  const earningsByMonth = myCompletedReservations.reduce((acc, reservation) => {
    const date = reservation.serviceDate ? new Date(reservation.serviceDate) : null;
    if (!date || isNaN(date.getTime())) return acc;

    const month = format(date, 'MMM yyyy');
    if (!acc[month]) {
      acc[month] = { total: 0, count: 0 };
    }
    acc[month].total += reservation.finalPrice ?? 0;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const monthlyData = Object.entries(earningsByMonth)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-6); // Últimos 6 meses

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Earnings Overview</h1>
        <p className="text-muted-foreground mt-2">
          Track your income and job performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.jobs} completed jobs
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Earnings (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map(([month, data]) => (
              <div
                key={month}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{month}</p>
                  <p className="text-sm text-muted-foreground">
                    {data.count} jobs completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">S/ {data.total.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: S/ {(data.total / data.count).toFixed(2)}/job
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Completed Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myCompletedReservations.slice(0, 10).map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{reservation.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.user.firstName} {reservation.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(reservation.serviceDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    S/ {(reservation.finalPrice ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Highest Earning Month</p>
              <p className="text-xl font-bold">
                {monthlyData.length > 0
                  ? monthlyData.reduce((max, curr) => 
                      curr[1].total > max[1].total ? curr : max
                    )[0]
                  : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                S/ {monthlyData.length > 0
                  ? monthlyData.reduce((max, curr) => 
                      curr[1].total > max[1].total ? curr : max
                    )[1].total.toFixed(2)
                  : '0.00'}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Most Productive Month</p>
              <p className="text-xl font-bold">
                {monthlyData.length > 0
                  ? monthlyData.reduce((max, curr) => 
                      curr[1].count > max[1].count ? curr : max
                    )[0]
                  : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                {monthlyData.length > 0
                  ? monthlyData.reduce((max, curr) => 
                      curr[1].count > max[1].count ? curr : max
                    )[1].count
                  : 0} jobs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
