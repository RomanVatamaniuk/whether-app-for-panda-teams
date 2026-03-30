export type WeatherView =
  | {
      avgTemp: number
      weather: { description: string; icon: string }
      humidity: number
      pressure: number
      windSpeed: number
    }
  | {
      date: string
      avgTemp: number
      weather: { description: string; icon: string }
      humidity: number
      pressure: number
      windSpeed: number
    }
