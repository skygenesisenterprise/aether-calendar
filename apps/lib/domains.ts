export type Environment = 'production' | 'localhost'

export interface DomainConfig {
  calendar: string
  sso: string
  protocol: string
}

const DOMAINS: Record<Environment, DomainConfig> = {
  production: {
    calendar: 'calendar.skygenesisenterprise.com',
    sso: 'sso.skygenesisenterprise.com',
    protocol: 'https',
  },
  localhost: {
    calendar: 'calendar.skygenesisenterprise.localhost',
    sso: 'sso.skygenesisenterprise.localhost',
    protocol: 'http',
  },
}

export function detectEnvironment(): Environment {
  if (typeof window === 'undefined') return 'production'
  return window.location.hostname.includes('localhost') ? 'localhost' : 'production'
}

export function getDomainConfig(): DomainConfig {
  return DOMAINS[detectEnvironment()]
}

export function getDomainUrl(service: 'sso' | 'calendar', path: string = ''): string {
  const config = getDomainConfig()
  return `${config.protocol}://${config[service]}${path}`
}
