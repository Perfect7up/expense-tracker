import { Card, CardContent, CardHeader } from "@/app/core/components/ui/card";
import { Skeleton } from "@/app/core/components/ui/skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-12">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl border border-slate-200/50 shadow-xl p-6 md:p-8 lg:p-10 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-200/50">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}