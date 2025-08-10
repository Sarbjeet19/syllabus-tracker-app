export default function ProgressBar({ progress }) {
  // Ensure progress is a number between 0 and 100
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    // This is the outer container, styled to be a light gray track
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
      <div
        // This is the inner bar. We are setting it to a vibrant green.
        className="bg-green-500 h-4 rounded-full text-xs font-semibold text-white flex items-center justify-center transition-all duration-500 ease-out"
        style={{ width: `${safeProgress}%` }}
      >
        {/* This part only shows the percentage text if the bar is wide enough */}
        {safeProgress > 10 && `${safeProgress.toFixed(0)}%`}
      </div>
    </div>
  );
}