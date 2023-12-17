# require-env-var
Simple npm package to require environment variables

## Install
```bash
# npm
npm i @vitaliystorchous/require-env-var

# yarn
yarn add @vitaliystorchous/require-env-var
```

## Usage
```typescript
import { requireEnvVar } from "@vitaliystorchous/require-env-var";

const DB_HOST = requireEnvVar('DB_HOST')

const DB_PORT = requireEnvVar('DB_PORT', {
  default: '27017'
})

const TEST_ENV = requrieEnvVar('TEST_ENV', {
  possibleValues: ['dev', 'stage', 'prod']
})
```

> For more examples, check [test](./test/) folder