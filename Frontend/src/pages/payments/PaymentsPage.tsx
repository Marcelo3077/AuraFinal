import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { PaymentService } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Calendar, DollarSign } from 'lucide-react';
import { PaymentStatus, PaymentMethod } from '@/types';
import { format } from 'date-fns';

export const PaymentsPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | 'ALL'>('ALL');

  const { data: payments, loading, execute: fetchPayments } = useApi(
    () => PaymentService.getMy(0, 50)
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case PaymentStatus.REFUNDED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CreditCard className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const filteredPayments = payments?.content.filter(payment => 
    selectedStatus === 'ALL' || payment.status === selectedStatus
  ) || [];

  const totalPaid = payments?.content
    .filter(p => p.status === PaymentStatus.COMPLETED)
    .reduce((sum, p) => sum + p.amount, 0) || 0;

  const pendingAmount = payments?.content
    .filter(p => p.status === PaymentStatus.PENDING)
    .reduce((sum, p) => sum + p.amount, 0) || 0;

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
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your payment transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {payments?.content.filter(p => p.status === PaymentStatus.COMPLETED).length || 0} completed payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/ {pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {payments?.content.filter(p => p.status === PaymentStatus.PENDING).length || 0} pending payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments?.totalElements || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'ALL' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus('ALL')}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === PaymentStatus.COMPLETED ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(PaymentStatus.COMPLETED)}
              >
                Completed
              </Button>
              <Button
                variant={selectedStatus === PaymentStatus.PENDING ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(PaymentStatus.PENDING)}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {getMethodIcon(payment.method)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {payment.reservation.service.name}
                        </p>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span>Method: {payment.method.replace('_', ' ')}</span>
                        {payment.transactionId && (
                          <span>ID: {payment.transactionId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">S/ {payment.amount.toFixed(2)}</p>
                      {payment.paidAt && (
                        <p className="text-xs text-muted-foreground">
                          Paid: {format(new Date(payment.paidAt), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                    {payment.status === PaymentStatus.COMPLETED && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
