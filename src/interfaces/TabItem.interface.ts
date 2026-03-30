import type { Component } from 'vue'

export interface TabItem {
  label: string
  component: () => Promise<{ default: Component }>
}
