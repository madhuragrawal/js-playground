
# JS Playground

This is a web-based JavaScript playground that allows users to execute JavaScript code in a safe, isolated environment. It provides an interactive coding interface using the Monaco Editor and displays execution results, including output, execution time, and memory usage. The backend is built using Node.js with Express, and code execution is isolated using the `isolated-vm` library (with an optional Web Worker option).

In addition, the project integrates various data structure definitions to help with common coding problems. These definitions include:

 - **ListNode**: A linked list node structure with methods for traversing the list and creating lists from arrays.
 - **TreeNode**: A binary tree node structure with methods for creating binary trees from arrays and performing various tree traversals (BFS, DFS).

These data structures are exposed to the user within the virtual environment, providing the flexibility to work with linked lists and trees in the executed code.

## Features

- **Monaco Editor**: Provides an interactive coding environment with syntax highlighting and autocompletion for JavaScript.
- **Isolated Execution**: Code is executed in a secure, isolated environment using `isolated-vm` to prevent malicious actions. You can also choose to run the code using a **Web Worker** for better performance and separation.
- **Rate Limiting**: Limits the number of requests per IP to prevent abuse (applies in production).
- **Performance Monitoring**: Tracks execution time and memory usage for each code execution.
- **Tree Visualization**: Supports visualizing data structures like trees, if applicable in the code output.

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (>= 16.0)
- **npm** (Node Package Manager)

### Steps to Install

1. Clone the repository:

   ```bash
   git clone https://github.com/madhuragrawal/js-playground.git
   cd js-playground
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set the necessary environment variables. Example:

   ```env
   PORT=3005
   NODE_ENV=development
   ENABLE_EXECUTE_API=true
   ```

   - **`ENABLE_EXECUTE_API=true`**: Set this variable to true to enable the isolated-vm API. If set to false, the isolated-vm API will be disabled, and the code execution will default to using Web Worker for isolation instead.

4. Start the development server:

   ```bash
   npm run dev
   ```

   This will start the server using `nodemon`, which automatically restarts the server when changes are made.

   Alternatively, for production:

   ```bash
   npm start
   ```

## How It Works

### Front-End (Client-Side)

- The front-end is built with standard HTML, CSS, and JavaScript.
- Monaco Editor is used as the code editor for the user interface.
- When the user clicks the "Run" button, the code is sent to the backend via a POST request (`/execute` route).
- The output is displayed in the `output-container`, along with the execution time and memory usage.
- The tree visualization feature extracts specific data from the code output and renders a tree structure if applicable.

### Back-End (Server-Side)

- The backend is built with Express, which handles incoming API requests.
- Code execution is isolated using the `isolated-vm` library to prevent unsafe operations like accessing `process`, `require`, or executing system commands.
- The `/execute` API route accepts JavaScript code, validates it, executes it in a secure environment, and returns the results (including output, execution time, and memory usage).

### Security Features

- **Code Validation**: Before executing user-provided code, the system checks for unsafe patterns like `require`, `process`, `child_process`, and `exec` to prevent malicious actions.
- **Isolated Execution**: The code runs inside a separate VM environment with limited memory and resources, ensuring that it cannot affect the server or other users.

### Rate Limiting

- To prevent abuse, rate limiting is applied on the `/execute` route in production. This limits each IP address to 5 requests per minute.

## API Documentation

### `POST /execute`

This endpoint allows the user to execute JavaScript code.

#### Request Body

```json
{
  "code": "console.log('Hello World')"
}
```

#### Response

```json
{
  "output": "Hello World",
  "executionTime": "50.34 ms",
  "memoryUsed": "1.23 MB"
}
```

#### Error Response

```json
{
  "error": "Invalid code: unsafe operations are not allowed."
}
```

### Rate Limiting Response

If the user exceeds the rate limit, they will receive the following response:

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## Credits

This project uses the following third-party libraries:

- [Monaco Editor](https://github.com/Microsoft/monaco-editor): A fast, feature-rich code editor for the web.
- [Isolated VM](https://github.com/wasmerio/isolated-vm): A high-performance virtual machine for running untrusted JavaScript code.
- [Express](https://expressjs.com/): Web framework for Node.js.
- [Rate Limit](https://www.npmjs.com/package/express-rate-limit): Rate limiting middleware for Express.
