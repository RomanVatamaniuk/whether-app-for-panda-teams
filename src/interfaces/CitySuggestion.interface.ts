export interface CitySuggestion {
  name: string
  country: string
  local_names?: Record<string, string>
  state?: string
  lat: number
  lon: number
}
