export function requireEnvVar(envVarName: string) {
  const value = process.env[envVarName]
  if (!value) {
    throw new Error(`environment variable is not defined: ${envVarName}`)
  } else {
    return value
  }
}