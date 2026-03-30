export interface WeatherData {
  dt: number
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}
