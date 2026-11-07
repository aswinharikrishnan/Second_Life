export default function SkeletonResult() {
  return (
    <div className="animate-pulse space-y-5">
      {/* Decision Badge */}
      <div className="h-20 rounded-xl bg-gray-800/60" />

      {/* Price Card */}
      <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-800/60 p-5">
        <div className="h-3 w-32 rounded bg-gray-700" />
        <div className="h-9 w-48 rounded bg-gray-700" />
        <div className="h-3 w-40 rounded bg-gray-700" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-gray-800/60" />
        ))}
      </div>

      {/* Chart */}
      <div className="h-52 rounded-xl bg-gray-800/60" />

      {/* Summary */}
      <div className="h-36 rounded-xl bg-gray-800/60" />
    </div>
  );
}

