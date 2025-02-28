import { Loader2 } from "lucide-react";

export default function AIAnalysisSkeleton() {
  return (
    <section className="p-6 bg-[#ddf8e8]/50 rounded-[9px] justify-start items-stretch gap-2.5 flex flex-row">
      {/* Icon skeleton with spinning loader */}
      <div className="flex flex-col justify-start size-fit py-[3px]">
        <Loader2 className="h-[14.5px] w-4 mt-[2px] text-green-600 animate-spin" />
      </div>

      {/* Analysis content skeleton */}
      <div className="w-full flex flex-col justify-start gap-8">
        {/* Overview skeleton with AI indicator */}
        <div className="flex flex-col justify-start items-stretch gap-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <span className="text-sm text-green-600 flex items-center gap-2">
              <span className="inline-block h-2 w-2 bg-green-500 rounded-full animate-ping" />
              AI Analysis in progress...
            </span>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-[90%]" />
          </div>
        </div>

        {/* Technical and Cultural Fit skeletons */}
        <div className="flex flex-row gap-8 w-full">
          {/* Technical Fit skeleton */}
          <div className="flex-1 flex-col flex gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-2 bg-green-500 rounded-full animate-ping opacity-50" />
            </div>
            <ul className="space-y-2 ml-5">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-center">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mr-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[90%]" />
                </li>
              ))}
            </ul>
          </div>

          {/* Cultural Fit skeleton */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-2 bg-green-500 rounded-full animate-ping opacity-50" />
            </div>
            <ul className="space-y-2 ml-5">
              {[1, 2, 3, 4].map((item) => (
                <li key={item} className="flex items-center">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mr-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-[90%]" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Recommendation skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-2 w-2 bg-green-500 rounded-full animate-ping opacity-50" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            {/* Chips skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
