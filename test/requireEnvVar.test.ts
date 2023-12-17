import {requireEnvVar} from "../src"
import { faker } from "@faker-js/faker"

describe('requireEnvVar', () => {
  test('env var is defined', () => {
    const envVarName = faker.string.alpha(5)
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

  test('env var is defined with default value', () => {
    const envVarName = faker.string.alpha(5)
    const envVarValue = faker.person.fullName()
    const defaultEnvVarValue = faker.string.uuid()
    process.env[envVarName] = envVarValue
    const value = requireEnvVar(envVarName, { default: defaultEnvVarValue })
    expect(value).toBe(envVarValue)
  })

  test('env var is not defined with default value', () => {
    const defaultEnvVarValue = faker.string.uuid()
    const value = requireEnvVar('THIS_ENV_VAR_DOES_NOT_EXIST', { default: defaultEnvVarValue })
    expect(value).toBe(defaultEnvVarValue)
  })

  test('env var is defined that matches possible values', () => {
    const envVarName = faker.string.alpha(5)
    const possibleValues = [
      faker.animal.cat(),
      faker.animal.bear(),
      faker.animal.bird()
    ]
    const envVarValue = faker.helpers.arrayElement(possibleValues)
    process.env[envVarName] = envVarValue
    const value = requireEnvVar(envVarName, { possibleValues: possibleValues })
    expect(value).toBe(envVarValue)
  })

  test('env var is defined that does not match possible values', () => {
    const envVarName = faker.string.alpha(5)
    const possibleValues = [
      faker.animal.cat(),
      faker.animal.bear(),
      faker.animal.bird()
    ]
    const envVarValue = faker.animal.cetacean()
    process.env[envVarName] = envVarValue
    const getEnvVarValue = () => requireEnvVar(envVarName, {
      possibleValues
    })
    let expectedMessageError = `environment variable contains unexpected value`
      + `\nenvironment variable: ${envVarName}`
      + `\nactual value: ${envVarValue}`
      + `\npossible values: ${JSON.stringify(possibleValues)}`
    expect(getEnvVarValue).toThrow(new Error(expectedMessageError))
  })

  test('env var is not defined and its default value matches possible values', () => {
    const envVarName = faker.string.alpha(5)
    const possibleValues = [
      faker.animal.cat(),
      faker.animal.bear(),
      faker.animal.bird()
    ]
    const defaultValue = faker.helpers.arrayElement(possibleValues)
    const value = requireEnvVar(envVarName, {
      possibleValues,
      default: defaultValue
    })
    expect(value).toBe(defaultValue)
  })

  test('env var is not defined and its default value does not match possible values', () => {
    const envVarName = faker.string.alpha(5)
    const possibleValues = [
      faker.animal.cat(),
      faker.animal.bear(),
      faker.animal.bird()
    ]
    const defaultValue = faker.animal.cetacean()
    const getEnvVarValue = () => requireEnvVar(envVarName, {
      possibleValues,
      default: defaultValue
    })
    let expectedMessageError = `environment variable contains unexpected value`
      + `\nenvironment variable: ${envVarName}`
      + `\nactual value: ${defaultValue}`
      + `\npossible values: ${JSON.stringify(possibleValues)}`
    expect(getEnvVarValue).toThrow(new Error(expectedMessageError))
  })
})