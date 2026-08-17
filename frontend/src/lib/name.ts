export function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return "?"
  }

  const firstInitial = words[0]?.charAt(0) ?? ""
  const lastInitial = words.length > 1 ? words.at(-1)?.charAt(0) ?? "" : ""

  return `${firstInitial}${lastInitial}`.toUpperCase()
}
