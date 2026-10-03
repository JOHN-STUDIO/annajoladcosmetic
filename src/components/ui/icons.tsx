import type { ReactNode } from 'react'

function baseIcon(children: ReactNode, size: number, label?: string): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {children}
    </svg>
  )
}

/** Standard shopping-cart outline — handle, basket and two wheels. */
export function CartIcon({ size = 20, label }: { size?: number; label?: string }) {
  return baseIcon(
    <>
      <path d="M4 5 h2 l1.9 9.6 a1.7 1.7 0 0 0 1.7 1.4 h7.6 a1.7 1.7 0 0 0 1.7 -1.4 L20.5 8 H6.6" />
      <circle cx="9.9" cy="19.6" r="1.3" />
      <circle cx="17.3" cy="19.6" r="1.3" />
    </>,
    size,
    label
  )
}

export function MenuIcon({ size = 22 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M4 6 h16" />
      <path d="M4 12 h16" />
      <path d="M4 18 h16" />
    </>,
    size
  )
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M6 6 l12 12 M18 6 l-12 12" />
    </>,
    size
  )
}

export function MinusIcon({ size = 18 }: { size?: number }) {
  return baseIcon(<path d="M5 12 h14" />, size)
}

export function PlusIcon({ size = 18 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M5 12 h14" />
      <path d="M12 5 v14" />
    </>,
    size
  )
}

export function TrashIcon({ size = 18 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M7 6 h10 v12 h-10 z" />
      <path d="M5 4 h14" />
    </>,
    size
  )
}

export function ChevronIcon({ size = 16 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M6 5 l12 12 M18 5 l-12 12" />
    </>,
    size
  )
}

export function ArrowRightIcon({ size = 16 }: { size?: number }) {
  return baseIcon(<path d="M5 12 h12 l6 -8 M17 4 l6 8 M17 12 l6 8 M5 12 l-2 2" />, size)
}

/** Official WhatsApp logo glyph (inherits currentColor — wrap with text-whatsapp for brand green). */
export function WhatsAppIcon({
  size = 20,
  label = 'WhatsApp',
  className
}: {
  size?: number
  label?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role="img"
      aria-label={label}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

/** Official TikTok logo glyph (inherits currentColor). */
export function TikTokIcon({
  size = 20,
  label = 'TikTok',
  className
}: {
  size?: number
  label?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      role="img"
      aria-label={label}
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export function InstagramIcon({ size = 20 }: { size?: number }) {
  return baseIcon(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12.5" r="5" />
      <circle cx="17" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    </>,
    size
  )
}

/**
 * Official Gmail logo (red & white envelope "M") — real brand colours,
 * matching the official Google Gmail mark. Not currentColor by design.
 */
export function MailIcon({ size = 18, label = 'Gmail' }: { size?: number; label?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={label}
    >
      <path
        d="M29.986 27.715H2.008C.915 27.715 0 26.85 0 25.733V6.376A2.01 2.01 0 0 1 2.008 4.37h27.978c1.093 0 2.008.9 2.008 2.008v19.33c-.025 1.144-.915 2.008-2.008 2.008z"
        fill="#f2f2f2"
      />
      <path
        d="M4 27.715l11.97-8.76.076-.508L3.7 9.578l-.025 17.705z"
        opacity=".1"
        fill="#221f1f"
      />
      <g fill="#d44c3d">
        <path d="M2.008 27.715C.9 27.715 0 26.85 0 25.733V6.35c0-1.118.9-1.32 2.008-1.32s2.008.23 2.008 1.32v21.364z" />
        <path d="M2.008 5.334c1.423 0 1.703.432 1.703 1.016v21.084H2.008c-.94 0-1.703-.762-1.703-1.703V6.35c-.025-.6.28-1.016 1.703-1.016zm0-.28C.9 5.055 0 5.283 0 6.35v19.356a1.98 1.98 0 0 0 2.008 2.008h2.008V6.35C4 5.258 3.126 5.055 2.008 5.055zm27.978.28c1.296 0 1.703.254 1.703.966v19.458c0 .94-.762 1.703-1.703 1.703h-1.703V6.3c-.025-.737.407-.966 1.703-.966zm0-.28c-1.118 0-2.008.152-2.008 1.245v21.44h2.008c1.118 0 2.008-.9 2.008-2.008V6.274c-.025-1.093-.915-1.22-2.008-1.22z"
        />
        <path d="M29.986 27.715h-2.008V6.3c0-1.118.9-1.245 2.008-1.245s2.008.152 2.008 1.245v19.458a2 2 0 0 1-2.008 1.957z" />
      </g>
      <path
        d="M21.422 27.715L.178 7.2l1.118.457 14.8 10.647L31.993 6.63v19.128a1.99 1.99 0 0 1-2.008 1.982z"
        opacity=".08"
        fill="#221f1f"
      />
      <g fill="#d44c3d">
        <path d="M15.96 18.98L.864 8.028c-.9-.66-1.144-1.93-.483-2.82s1.93-1.093 2.846-.432l12.757 9.275L28.817 4.65c.9-.66 2.135-.457 2.795.457.66.9.457 2.135-.457 2.795z" />
        <path d="M29.986 4.572c.534 0 1.067.254 1.398.712.534.762.38 1.83-.38 2.4L15.96 18.625 1.042 7.8C.28 7.24.076 6.147.6 5.4c.305-.457.84-.737 1.423-.737.38 0 .737.102 1.016.33l12.73 9.25.178.102.178-.102 12.82-9.393c.33-.178.66-.28 1.042-.28zm0-.305c-.407 0-.84.102-1.17.38L15.984 14.05 3.202 4.75c-.33-.254-.762-.38-1.194-.38-.635.025-1.27.305-1.652.84-.635.9-.38 2.135.508 2.795L15.96 18.98 31.155 7.9a2.02 2.02 0 0 0 .457-2.795c-.407-.534-1.016-.84-1.626-.84z"
        />
      </g>
    </svg>
  )
}

export function PinIcon({ size = 18 }: { size?: number }) {
  return baseIcon(
    <>
      <path d="M12 8 a5.5 5.5 0 1 0 0 0 a5.5 5.5 0 1 0 0 0 a5.5 5.5 0 1 0 0 0" />
      <path d="M12 13.5 L13 20 L11 20 Z" />
    </>,
    size
  )
}

export function ClockIcon({ size = 18 }: { size?: number }) {
  return baseIcon(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 4.5 v15 M5.5 12 h13" />
    </>,
    size
  )
}

export function CheckIcon({ size = 16 }: { size?: number }) {
  return baseIcon(<path d="M5 4 L12 11.5 M12 11.5 L19 6 M12 11.5 L8 15" />, size)
}

export function SparkleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 12 M4 4 L12 12 L20 4 M5.5 12 L12 16.5 L20 12 L12 6.5 Z" stroke="none" />
    </svg>
  )
}

export function LeafIcon({ size = 22 }: { size?: number }) {
  return baseIcon(
    <path d="M12 3 C15 7 18 11 20 16 17 20 13 21 8 18 6 13 5 8 8 5 12 3 Z" />,
    size
  )
}

/**
 * Indeterminate loading spinner. Use inside a Button while an action is
 * running (`loading` prop) so a click always gives visible feedback.
 */
export function SpinnerIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      className={`animate-spin ${className}`.trim()}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12 a9 9 0 0 0 -9 -9" />
    </svg>
  )
}