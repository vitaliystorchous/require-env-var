import {requireEnvVar} from "../src"
import { faker } from "@faker-js/faker"

describe('requireEnvVar', () => {
  test('env var is defined', () => {
    const envVarName = faker.string.alpha({
      length: {
        min: 5,
        max: 10,
      },
      casing: 'upper'
    })
    const envVarValue = faker.person.fullName()
    process.env[envVarName] = envVarValue
    const value = requireEnvVar(envVarName)
    expect(value).toBe(envVarValue)
  })

  test('env var is not defined', () => {
    const getNotExistingEnvVar = () => requireEnvVar('THIS_ENV_VAR_DOES_NOT_EXIST')
    const expectedError = new Error(`environment variable is not defined: THIS_ENV_VAR_DOES_NOT_EXIST`)
    expect(getNotExistingEnvVar).toThrow(expectedError)
  })
})