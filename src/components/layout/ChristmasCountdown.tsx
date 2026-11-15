import { useEffect, useState } from 'react'

/** Snowflake SVG used as decorative accents on both sides of the banner. */
function Snowflake({ x, y, size = 24, opacity = 0.6 }: { x: string | number; y: string | number; size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute pointer-events-none"
      style={{ left: x, top: y, opacity }}
      aria-hidden="true"
    >
      <path d="M12 2 v20 M2 12 h20 M16.8 7.2 l-2.8 2.8 M16.8 16.8 l-2.8 -2.8 M7.2 16.8 l2.8 -2.8 M7.2 7.2 l2.8 2.8" />
    </svg>
  )
}

/** Countdown digit block — white number and white label beneath. */
function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-white font-display">{value.toString().padStart(2, '0')}</span>
      <span className="text-[10px] uppercase tracking-wider text-white/90 font-sans">{label}</span>
    </div>
  )
}

/**
 * Christmas countdown banner — recreated from the brand reference.
 * Shows a live days/hours/minutes/seconds countdown to 25 December 2026.
 */
export default function ChristmasCountdown() {
  const targetDate = new Date('December 25, 2026 00:00:00').getTime()

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  // Decorative snowflakes are rendered inline below (left & right edges)

  return (
    <section
      className="relative overflow-hidden"
      aria-label="Christmas countdown"
    >
      {/* Background gradient — deep red */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#7a0000_0%,#a51a1a_100%)] -z-10" />

      {/* Snowflake decorations — left side */}
      <Snowflake x={12} y={10} size={28} opacity={0.5} />
      <Snowflake x={24} y={40} size={20} opacity={0.4} />
      <Snowflake x={36} y={70} size={32} opacity={0.6} />
      <Snowflake x={8} y={100} size={18} opacity={0.3} />
      <Snowflake x={40} y={120} size={24} opacity={0.5} />
      <Snowflake x={-8} y="85%" size={30} opacity={0.4} />
      <Snowflake x={50} y="60%" size={22} opacity={0.5} />

      {/* Snowflake decorations — right side */}
      <Snowflake x="92%" y={15} size={26} opacity={0.5} />
      <Snowflake x="88%" y={55} size={18} opacity={0.3} />
      <Snowflake x="96%" y={95} size={30} opacity={0.6} />
      <Snowflake x="80%" y={125} size={20} opacity={0.4} />
      <Snowflake x="100%" y={80} size={24} opacity={0.5} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between gap-6 text-center lg:text-left">
          <div className="flex flex-col items-center gap-2 lg:items-start lg:text-left">
            <h2 className="text-2xl font-bold text-white font-display tracking-tight sm:text-3xl">
              Christmas is Coming:
            </h2>
            <p className="mt-1 text-white/90 text-sm font-sans">
              We Are Waiting For the Precious Time
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
            <span className="text-white text-[14px] font-sans hidden lg:inline">Time remaining:</span>
            <div className="flex items-baseline gap-2 lg:gap-3">
              <CountBlock value={countdown.days} label="DAYS" />
              <span className="text-white text-[24px] font-bold mx-1 lg:mx-2">:</span>
              <CountBlock value={countdown.hours} label="HRS" />
              <span className="text-white text-[24px] font-bold mx-1 lg:mx-2">:</span>
              <CountBlock value={countdown.minutes} label="MIN" />
              <span className="text-white text-[24px] font-bold mx-1 lg:mx-2">:</span>
              <CountBlock value={countdown.seconds} label="SEC" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}