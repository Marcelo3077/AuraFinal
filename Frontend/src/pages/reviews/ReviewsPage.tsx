import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { ReviewService, ReservationService } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Calendar, User } from 'lucide-react';
import { ReservationStatus } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const ReviewsPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: reviews, loading: loadingReviews, execute: fetchReviews } = useApi(
    () => ReviewService.getMy(0, 50)
  );

  const { data: completedReservations, loading: loadingReservations, execute: fetchCompletedReservations } = useApi(
    () => ReservationService.getByStatus(ReservationStatus.COMPLETED, 0, 50)
  );

  const { loading: submitting, execute: submitReview } = useApi(
    (data: any) => ReviewService.create(data)
  );

  useEffect(() => {
    fetchReviews();
    fetchCompletedReservations();
  }, []);

  const reviewedReservationIds = new Set(reviews?.content.map(r => r.reservation.id) || []);
  
  const unreviewed = completedReservations?.content.filter(
    res => !reviewedReservationIds.has(res.id)
  ) || [];

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      await submitReview({
        reservationId: selectedReservation.id,
        rating,
        comment: comment.trim(),
      });
      toast.success('Review submitted successfully');
      setIsCreateDialogOpen(false);
      setRating(0);
      setComment('');
      setSelectedReservation(null);
      fetchReviews();
      fetchCompletedReservations();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= (interactive ? (hoveredRating || currentRating) : currentRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  if (loadingReviews || loadingReservations) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Reviews</h1>
          <p className="text-muted-foreground mt-2">
            Manage your service reviews and ratings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviews?.totalElements || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reviews?.content.length
                ? (reviews.content.reduce((sum, r) => sum + r.rating, 0) / reviews.content.length).toFixed(1)
                : '0.0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreviewed.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {unreviewed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreviewed.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{reservation.service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Technician: {reservation.technician.firstName} {reservation.technician.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed: {format(new Date(reservation.serviceDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setIsCreateDialogOpen(true);
                  }}
                >
                  Write Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Submitted Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews?.content.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews?.content.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {review.technician.firstName} {review.technician.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.reservation.service.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Review Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {selectedReservation?.technician.firstName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-2">
                {renderStars(rating, true)}
                <span className="text-sm text-muted-foreground ml-2">
                  {rating > 0 ? `${rating}/5` : 'Select rating'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setRating(0);
                setComment('');
                setSelectedReservation(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
