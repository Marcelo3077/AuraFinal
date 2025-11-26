import { useEffect, useState } from 'react';
import { useAuth, useApi } from '@/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ReservationService, ReviewService } from '@/api';
import { Calendar, Clock, CheckCircle, Star, DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ReservationStatus } from '@/types';
import { format } from 'date-fns';

export const TechnicianDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'confirmed' | 'completed'>('pending');

  const { data: allReservations, loading: loadingReservations, execute: fetchReservations } = useApi(
    () => ReservationService.getAll(0, 100)
  );

  const { data: reviews, loading: loadingReviews, execute: fetchReviews } = useApi(
    () => ReviewService.getAll(0, 100)
  );

  useEffect(() => {
    fetchReservations();
    fetchReviews();
  }, []);

  // Filtrar reservaciones del técnico actual
  const myReservations = allReservations?.content?.filter(
    r => r.technician?.id === user?.id
  ) || [];

  const pendingReservations = myReservations.filter(r => r.status === ReservationStatus.PENDING);
  const confirmedReservations = myReservations.filter(r => r.status === ReservationStatus.CONFIRMED);
  const completedReservations = myReservations.filter(r => r.status === ReservationStatus.COMPLETED);
  const inProgressReservations = myReservations.filter(r => r.status === ReservationStatus.IN_PROGRESS);

  // Calcular estadísticas
  const totalEarnings = completedReservations.reduce((sum, r) => sum + (r.finalPrice || 0), 0);
  const monthlyEarnings = completedReservations
    .filter(r => {
      const date = new Date(r.serviceDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + (r.finalPrice || 0), 0);

  // Calcular rating promedio
  const myReviews = reviews?.content?.filter(r => r.technician?.id === user?.id) || [];
  const averageRating = myReviews.length > 0
    ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Pending Requests',
      value: pendingReservations.length,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      title: 'Active Jobs',
      value: confirmedReservations.length + inProgressReservations.length,
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'Monthly Earnings',
      value: `S/ ${monthlyEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: 'Average Rating',
      value: `${averageRating} ⭐`,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    },
  ];

  const handleConfirm = async (reservationId: number) => {
    try {
      await ReservationService.confirm(reservationId);
      fetchReservations();
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  const handleComplete = async (reservationId: number) => {
    try {
      await ReservationService.complete(reservationId);
      fetchReservations();
    } catch (error) {
      console.error('Error completing reservation:', error);
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ReservationStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ReservationStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case ReservationStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ReservationStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderReservations = (reservations: any[]) => {
    if (reservations.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No reservations in this category
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reservations.map((reservation) => {
          const price = reservation.finalPrice ?? 0;

          return (
            <div
              key={reservation.id}
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{reservation.service.name}</h3>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Client: {reservation.user.firstName} {reservation.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {reservation.user.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">S/ {price.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(reservation.serviceDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{reservation.startTime}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p className="font-medium">{reservation.address}</p>
                </div>
                {reservation.notes && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Notes</p>
                    <p className="text-sm">{reservation.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {reservation.status === ReservationStatus.PENDING && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(reservation.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Job
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/reservations/${reservation.id}`)}
                    >
                      View Details
                    </Button>
                  </>
                )}
                {reservation.status === ReservationStatus.CONFIRMED && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleComplete(reservation.id)}
                    >
                      Mark as Completed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/reservations/${reservation.id}`)}
                    >
                      View Details
                    </Button>
                  </>
                )}
                {reservation.status === ReservationStatus.COMPLETED && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/reservations/${reservation.id}`)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loadingReservations || loadingReviews) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Technician Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.firstName}! Manage your jobs and track your earnings.
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
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myReservations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReservations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Success rate: {myReservations.length > 0 
                ? ((completedReservations.length / myReservations.length) * 100).toFixed(0)
                : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average: {averageRating} stars
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Job Requests</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('pending')}
              >
                Pending ({pendingReservations.length})
              </Button>
              <Button
                size="sm"
                variant={selectedTab === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('confirmed')}
              >
                Active ({confirmedReservations.length + inProgressReservations.length})
              </Button>
              <Button
                size="sm"
                variant={selectedTab === 'completed' ? 'default' : 'outline'}
                onClick={() => setSelectedTab('completed')}
              >
                Completed ({completedReservations.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedTab === 'pending' && renderReservations(pendingReservations)}
          {selectedTab === 'confirmed' && renderReservations([...confirmedReservations, ...inProgressReservations])}
          {selectedTab === 'completed' && renderReservations(completedReservations)}
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      {myReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myReviews.slice(0, 5).map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.reservation.service.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Earnings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Earnings Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">This Month</p>
                <p className="text-2xl font-bold">S/ {monthlyEarnings.toFixed(2)}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-2xl font-bold">S/ {totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Average per Job</p>
              <p className="text-xl font-bold">
                S/ {completedReservations.length > 0
                  ? (totalEarnings / completedReservations.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
