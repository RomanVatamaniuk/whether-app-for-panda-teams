import type { WeatherForecastData } from './WeatherForecast.interface'

export interface City {
  id?: string
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  weather: WeatherForecastData
}
