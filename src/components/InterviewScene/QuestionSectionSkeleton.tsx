import { Skeleton } from '@/components/ui/skeleton';
import { FE_ASSETS } from '@/constants/imageAssets';

export default function QuestionSectionSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="h-[85vh] grid grid-cols-[1fr_3fr] grid-rows-[1fr_1fr] gap-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${FE_ASSETS.DASHBOARD.INTERVIEW_ROOM_BACKGROUND_IMAGE})` }}
      >
        <div className="col-start-1 col-end-2 row-start-1 row-end-2 p-4">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>

        <div className="col-start-1 col-end-2 row-start-2 row-end-3 p-4">
          <div className="relative w-full h-full">
            <Skeleton className="absolute inset-0 rounded-lg bg-gray-300/80" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Skeleton className="w-32 h-32 rounded-full bg-gray-400/80" />
            </div>
          </div>
        </div>

        <div className="col-start-2 col-end-3 row-start-1 row-end-3 p-4">
          <div className="w-full h-full bg-white/90 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full h-4"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Caption skeleton */}
      <div className="p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="w-3/4 h-8 mx-auto rounded-lg" />
        </div>
      </div>
    </div>
  );
}
