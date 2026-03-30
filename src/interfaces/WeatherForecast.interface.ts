import type { ForecastItem } from '@/types/ForecastItem.type'

export interface WeatherForecastData {
  city: {
    name: string
    country: string
  }
  list: ForecastItem[]
}
