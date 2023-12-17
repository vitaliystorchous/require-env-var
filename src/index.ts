export function requireEnvVar(envVarName: string, options?: {
  default?: string
}) {
  const value = process.env[envVarName]
  if (value) {
    return value
  } else {
    if (options?.default) {
      return options.default
    } else {
      throw new Error(`environment variable is not defined: ${envVarName}`)
    }
  }
}
