export function requireEnvVar(envVarName: string, options?: { default: string }): string
export function requireEnvVar<V extends string>(envVarName: string, options?: { default?: V, possibleValues?: V[] }): V
export function requireEnvVar<V extends string>(envVarName: string, options?: {
  default?: V
  possibleValues?: V[]
}): V {
  let value = process.env[envVarName] as V | undefined
  if (value) {
    if (options?.possibleValues) {
      const isOneOfPossible = options.possibleValues.includes(value)
      if (!isOneOfPossible) {
        if (options.default) {
          return options.default
        } else {
          const message = `environment variable contains unexpected value`
            + `\nenvironment variable: ${envVarName}`
            + `\nactual value: ${value}`
            + `\npossible values: ${JSON.stringify(options.possibleValues)}`
          throw new Error(message)
        }
      }
    }
    return value
  } else {
    if (options?.default) {
      return options.default
    } else {
      throw new Error(`environment variable is not defined: ${envVarName}`)
    }
  }
}
