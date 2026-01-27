/**
 * Mobile Device Frame
 * Wraps the app in an iPhone-like viewport for development
 */

export default function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="relative">
        {/* Device Bezel */}
        <div className="bg-gray-800 rounded-[3rem] p-3 shadow-2xl">
          {/* Screen */}
          <div className="bg-white dark:bg-black rounded-[2.5rem] overflow-hidden relative" style={{ width: '390px', height: '844px' }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>

            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-6 pt-2 text-white text-xs z-40">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <span>📶</span>
                <span>📡</span>
                <span>🔋</span>
              </div>
            </div>

            {/* App Content - Scrollable */}
            <div className="h-full overflow-y-auto pt-12 pb-8">
              {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>

        {/* Device Info Label */}
        <div className="text-center mt-4 text-gray-400 text-sm">
          iPhone 14 Pro Viewport (390×844)
        </div>
      </div>
    </div>
  );
}
