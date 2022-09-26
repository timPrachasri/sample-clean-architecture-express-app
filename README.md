

## Getting Started
---
 

### Prerequisites
 ```bash
  # Install the development/deployment dependencies
  yarn install
  ```

### Starting API (non-docker)
  ```bash
  yarn dev
  ```

  > in case you want to debug, please use vscode launch.json to attach a debugger on it

### Starting API (using docker)
  ```base
    make docker/up
  ```  
### Environment Variables
```bash
NODE_ENV="develop" // develop | prod

```
