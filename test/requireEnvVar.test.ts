import {requireEnvVar} from "../src"
import { faker } from "@faker-js/faker"

describe('requireEnvVar', () => {
  describe('function checks', () => {
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

    test('env var is defined that does not match possible values with default value', () => {
      const envVarName = faker.string.alpha(5)
      const possibleValues = [
        faker.animal.cat(),
        faker.animal.bear(),
        faker.animal.bird()
      ]
      const envVarValue = faker.animal.cetacean()
      process.env[envVarName] = envVarValue
      const defaultValue = faker.animal.cow()
      const value = requireEnvVar(envVarName, {
        possibleValues,
        default: defaultValue
      })
      expect(value).toBe(defaultValue)
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
      const value = requireEnvVar(envVarName, {
        possibleValues,
        default: defaultValue
      })
      expect(value).toBe(defaultValue)
    })
  })

  describe("type checks", () => {
    const envVarName = faker.string.alpha(5)
    const consumeString = (arg: string) => arg
    const consumeNumber = (arg: number) => arg
    const consumeOneLiteral = (arg: "one") => arg
    const consumeTwoLiterals = (arg: "one" | "two") => arg
    const consumeThreeLiterals = (arg: "one" | "two" | "three") => arg

    test('string return type with no options', () => {
      () => {
        const value = requireEnvVar(envVarName)
        consumeString(value)
        consumeNumber(
          // @ts-expect-error
          value
        )
        consumeOneLiteral(
          // @ts-expect-error
          value
        )
        consumeTwoLiterals(
          // @ts-expect-error
          value
        )
        consumeThreeLiterals(
          // @ts-expect-error
          value
        )
      }
    })

    test('string return type with only default option used', () => {
      () => {
        const value = requireEnvVar(envVarName, {
          default: 'hello'
        })
        consumeString(value)
        consumeNumber(
          // @ts-expect-error
          value
        )
        consumeOneLiteral(
          // @ts-expect-error
          value
        )
        consumeTwoLiterals(
          // @ts-expect-error
          value
        )
        consumeThreeLiterals(
          // @ts-expect-error
          value
        )
      }
    })

    test('literal return type with only possibleValues option used', () => {
      () => {
        const value = requireEnvVar(envVarName, {
          possibleValues: ["one", "two"]
        })
        consumeString(value)
        consumeNumber(
          // @ts-expect-error
          value
        )
        consumeOneLiteral(
          // @ts-expect-error
          value
        )
        consumeTwoLiterals(
          value
        )
        consumeThreeLiterals(
          value
        )
      }
    })

    test('literal return type with possibleValues and default options', () => {
      () => {
        const value = requireEnvVar(envVarName, {
          possibleValues: ["one", "two"],
          default: "three"
        })
        consumeString(value)
        consumeNumber(
          // @ts-expect-error
          value
        )
        consumeOneLiteral(
          // @ts-expect-error
          value
        )
        consumeTwoLiterals(
          // @ts-expect-error
          value
        )
        consumeThreeLiterals(
          value
        )
      }
    })

    test('non string type provided to possibleValues and default options', () => {
      () => {
        // @ts-expect-error
        requireEnvVar(envVarName, {
          possibleValues: [true],
        })
        requireEnvVar(envVarName, {
          // @ts-expect-error
          default: 1
        })
        requireEnvVar(envVarName, {
          // @ts-expect-error
          possibleValues: [1, 2]
        })
      }
    })
  })
})