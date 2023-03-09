# Welcome to the JSON Crack Contributing Guide <!-- omit in toc -->

Thank you for investing your time in contributing to our project! Any contribution you make will be reflected at [jsoncrack.com](https://jsoncrack.com).

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## Getting Started
JSON Crack is built with React, Reaflow for visualization, Mantine UI for components, Zustand for state management, and Altogic for backend integration. If you are not familiar with these technologies, we recommend you to read their documentation to get started. You can find the links to the respective documentations below:

* [React](https://reactjs.org/docs/getting-started.html)
* [Reaflow](https://github.com/reaviz/reaflow)
* [Mantine UI](https://mantine.dev/)
* [Zustand](https://github.com/pmndrs/zustand)
* [Altogic](https://www.altogic.com/)

Once you are familiar with these technologies, you can clone the JSON Crack repository by running the following command:

```bash
git clone https://github.com/AykutSarac/jsoncrack.com.git
```

After cloning the repository, you can install the required dependencies by running the following command:

```bash
yarn install
```

To run the development server, you can run the following command:

```bash
yarn dev
```

## Contributing Guidelines
Before submitting a pull request, please make sure to follow these guidelines:

### 1. Performance
Performance is an important criteria for JSON Crack. Any new contributions should not affect the re-rendering of the application. Therefore, when making changes to the code, please keep performance in mind.

If you're having trouble with re-rendering issues in React, you can use the React Devtools Profiler to debug it. You can also check out this up-to-date guide on debugging re-renders with React Devtools to learn more.

### 2. Code Style
We follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) for our code. Please make sure to follow this guide when writing new code or modifying existing code.

### 3. Testing
While we do not currently have a comprehensive testing suite in place, we encourage contributors to thoroughly test their changes and ensure that they do not break any existing functionality. Please include a description of how you tested your changes in your pull request, so that we can review them more effectively.

### 4. Commit Messages
Please use descriptive commit messages that explain the changes you have made. This will help us understand your changes and make it easier to review your pull request.

### 5. Pull Requests
Please create a new branch for your changes and submit a pull request to the main branch. Please provide a detailed explanation of the changes you have made and any necessary context in the pull request description.

## Conclusion
We appreciate any contributions to JSON Crack, big or small. If you have any questions or need any help, please do not hesitate to reach out to us. Thank you for contributing!

### Your PR is merged!

Congratulations :tada::tada: The JSON Crack team thanks you :sparkles:.

Once your PR is merged, your contributions will become part of the next JSON Crack release, and will be visible in the [JSON Crack app](https://jsoncrack.com).
