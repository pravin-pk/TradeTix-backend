# Load Testing Guide

This load test relies on the *Artillery Library* to perform and visualize the load test of the Trade-Tix Backend APIs.

Guide on running this test can found here - https://www.artillery.io/docs/get-started/first-test

#### Command to run the test

> ```bash
> artillery run artillery_load_test_script.yml
> ```

#### API Endpoints being tested

The test script tests the following API endpoints -

```
  - name: Test API Endpoints
    flow:
      - get:
          url: "/api/users/me"
      - get:
          url: "/api/tickets/open"
      - get:
          url: "/api/tickets/67459e334b2efdc6b9116c2c"
      - get:
          url: "/api/tickets/67459e444b2efdc6b9116c31"
      - get:
          url: "/api/tickets/67459e774b2efdc6b9116c45"
      - get:
          url: "/api/tickets/67459e584b2efdc6b9116c3b"
      - get:
          url: "/api/tickets/67459e5f4b2efdc6b9116c40"
      - get:
          url: "/api/health"
```
