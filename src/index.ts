export function requireEnvVar(envVarName: string, options?: {
  default?: string
  possibleValues?: string[]
}): string {
  let value = process.env[envVarName]
  if (!value) {
    if (options?.default) {
      value = options.default
    } else {
      throw new Error(`environment variable is not defined: ${envVarName}`)
    }
  }

  if (options?.possibleValues) {
    const isOneOfPossible = options.possibleValues.includes(value)
    if (!isOneOfPossible) {
      const message = `environment variable contains unexpected value`
        + `\nenvironment variable: ${envVarName}`
        + `\nactual value: ${value}`
        + `\npossible values: ${JSON.stringify(options.possibleValues)}`
      throw new Error(message)
    }
  }

  return value
}
