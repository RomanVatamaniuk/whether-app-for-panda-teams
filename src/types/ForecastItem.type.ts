export type ForecastItem = {
  dt: number
  main: {
    temp: number
    humidity: number
    pressure: number
  }
  weather: {
    main: string
    description: string
    icon: string
  }[]
  wind: {
    speed: number
  }
}
