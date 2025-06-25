# mcp-nextjs

## Project Overview

This is a Next.js-based application that provides an MCP (Model Context Protocol) server with OAuth 2.1 authentication support. It is intended as a model for building your own MCP server in a Next.js context. It uses the [@vercel/mcp-adapter](https://github.com/vercel/mcp-adapter) to handle the MCP protocol, in order to support both SSE and Streamable HTTP transports.

## Tech Stack

- next.js
- @vercel/mcp-adapter
- vercel
- drizzle orm

## Best Practices

Here are some best practices for the tools you listed, keeping in mind a collaborative and efficient approach:

### Next.js

Next.js is a powerful React framework that enables features like server-side rendering (SSR) and static site generation (SSG) out of the box. To make the most of it, here's a simple best practices guide:

### 1\. **Leverage Data Fetching Methods Appropriately**

Next.js offers several ways to fetch data, each with its own use case:

  * **`getStaticProps` (Static Site Generation - SSG):**

      * **When to use:** For data that can be fetched at build time and is the same for all users. Ideal for blogs, marketing pages, documentation, etc.
      * **Benefit:** Extremely fast as pages are pre-rendered as HTML and served from a CDN.
      * **Example:**
        ```javascript
        export async function getStaticProps() {
          const res = await fetch('https://api.example.com/posts');
          const posts = await res.json();
          return {
            props: {
              posts,
            },
            revalidate: 60, // Optional: Re-generate page every 60 seconds (ISR)
          };
        }
        ```

  * **`getServerSideProps` (Server-Side Rendering - SSR):**

      * **When to use:** For data that needs to be fetched on each request and is dynamic (e.g., user-specific data, real-time dashboards).
      * **Benefit:** Always up-to-date data, but slower than SSG as the server renders the page on every request.
      * **Example:**
        ```javascript
        export async function getServerSideProps(context) {
          const res = await fetch(`https://api.example.com/user/${context.params.id}`);
          const userData = await res.json();
          return {
            props: {
              userData,
            },
          };
        }
        ```

  * **Client-side Fetching (e.g., `useEffect` with `fetch` or a library like SWR/React Query):**

      * **When to use:** For data that doesn't need to be pre-rendered or for interactive components that fetch data after the initial page load (e.g., search results, comments section).
      * **Benefit:** Allows for dynamic content within client-rendered parts of your page. Use SWR or React Query for better caching, revalidation, and error handling.
      * **Example (with SWR):**
        ```javascript
        import useSWR from 'swr';

        const fetcher = (...args) => fetch(...args).then(res => res.json());

        function Profile() {
          const { data, error } = useSWR('/api/user', fetcher);

          if (error) return <div>Failed to load</div>;
          if (!data) return <div>Loading...</div>;

          return <div>Hello {data.name}!</div>;
        }
        ```

### 2\. **Optimize Images with `next/image`**

The `next/image` component is essential for performance:

  * **Automatic Optimization:** Automatically optimizes images for different screen sizes and formats (e.g., WebP) and lazy-loads them.
  * **Prevent Cumulative Layout Shift (CLS):** Requires `width` and `height` props to prevent layout shifts.
  * **Example:**
    ```javascript
    import Image from 'next/image';

    function MyImage() {
      return (
        <Image
          src="/my-image.jpg"
          alt="Description of my image"
          width={500}
          height={300}
          layout="responsive" // Or "intrinsic", "fixed", "fill"
        />
      );
    }
    ```

### 3\. **Use `next/link` for Client-Side Navigation**

Always use `next/link` for navigating between pages within your Next.js application:

  * **Client-Side Transitions:** Provides fast, client-side navigation without full page reloads.
  * **Pre-fetching:** Automatically pre-fetches linked pages in the background for even faster transitions.
  * **Example:**
    ```javascript
    import Link from 'next/link';

    function HomePage() {
      return (
        <Link href="/about">
          <a>Go to About Page</a>
        </Link>
      );
    }
    ```

### 4\. **Organize Your Project Structure**

While Next.js is flexible, a consistent structure helps maintainability:

  * **`pages/`:** Contains your route files (e.g., `pages/index.js`, `pages/about.js`).
  * **`components/`:** Reusable React components.
  * **`public/`:** Static assets like images, fonts, and robots.txt.
  * **`styles/`:** Global styles or CSS Modules.
  * **`lib/` or `utils/`:** Helper functions, API clients, or data fetching logic.
  * **`api/` (Optional):** API routes if you're using Next.js's API features.

### 5\. **Environment Variables**

Manage sensitive information and configuration using environment variables:

  * **`.env.local`:** For local development.
  * **`.env.production`:** For production.
  * **Accessing:**
      * **Server-side:** `process.env.MY_SECRET_KEY`
      * **Client-side (prefixed with `NEXT_PUBLIC_`):** `process.env.NEXT_PUBLIC_API_URL`
  * **Example:**
    ```javascript
    // .env.local
    NEXT_PUBLIC_API_URL=http://localhost:3000/api

    // In your code
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    ```

### 6\. **Error Handling (Custom Error Pages)**

Create custom error pages for a better user experience:

  * **`pages/_error.js`:** For generic errors (e.g., server errors).
  * **`pages/404.js`:** For "page not found" errors.

### 7\. **Accessibility (A11y)**

Prioritize accessibility from the start:

  * **Semantic HTML:** Use appropriate HTML tags.
  * **ARIA Attributes:** Add ARIA attributes when needed for custom components.
  * **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible.
  * **Alt Text:** Always provide descriptive `alt` text for images.

### 8\. **Testing**

Implement testing for reliability:

  * **Unit Tests:** Jest, React Testing Library for individual components and functions.
  * **Integration Tests:** Cypress, Playwright for testing interactions between components and pages.

By following these simple best practices, you can build efficient, scalable, and user-friendly Next.js applications.

### Langchain.js

- **Modularize Chains:** Break down complex logic into smaller, composable chains for better reusability and testability.
- **Leverage Memory:** Utilize Langchain's memory capabilities to maintain context across interactions in conversational AI applications. Choose the appropriate memory type for your use case.
- **Implement Callbacks:** Use callbacks for logging, tracing, and custom event handling within your Langchain applications. This is crucial for debugging and monitoring.
- **Handle Errors Gracefully:** Implement robust error handling within your chains to prevent unexpected crashes and provide informative feedback.
- **Secure API Keys:** Store API keys securely using environment variables or dedicated secret management tools. Avoid hardcoding them in your application.
- **Understand Token Usage:** Be mindful of token limits when using large language models. Implement strategies to manage token usage effectively.
- **Experiment with Different Models:** Explore various language models available through Langchain integrations to find the best fit for your specific tasks.
- **Document Your Chains:** Clearly document the purpose and functionality of your custom chains.

### Langgraph.js

- **Design Clear Graphs:** Visualize and plan your Langgraph flows before implementation. Ensure a logical progression of nodes and edges.
- **Utilize State Management:** Understand and effectively manage the state within your Langgraph to pass information between steps.
- **Implement Conditional Logic:** Leverage conditional edges and router nodes to create dynamic and branching conversational flows.
- **Handle Asynchronous Operations:** Be aware of the asynchronous nature of graph execution and handle promises appropriately.
- **Test Individual Nodes:** Test the functionality of individual nodes in your graph to ensure they behave as expected before integrating them into the larger flow.
- **Monitor Graph Execution:** Implement logging and monitoring to track the execution of your Langgraph and identify potential bottlenecks or errors.
- **Iterate and Refine:** Langgraph allows for complex conversational flows. Iterate on your graph design based on user feedback and performance analysis.

### AI SDK

- **Follow SDK Documentation:** Adhere closely to the official documentation and best practices provided by the specific AI SDK you are using (e.g., OpenAI, Google Cloud AI).
- **Understand API Rate Limits:** Be aware of and implement strategies to handle API rate limits to prevent service disruptions.
- **Implement Authentication Properly:** Securely handle authentication credentials as outlined by the SDK provider.
- **Utilize SDK Features:** Take advantage of the helper functions and abstractions provided by the SDK to simplify API interactions.
- **Handle API Errors:** Implement proper error handling for API requests and responses.
- **Version Control Your SDK:** Pin your SDK dependencies to specific versions to ensure stability and avoid unexpected breaking changes.
- **Monitor API Usage and Costs:** Keep track of your API usage and associated costs.

### `@langchain/google-genai`

- **Authenticate Securely:** Use appropriate authentication methods for Google Cloud, such as service accounts, and manage credentials securely.
- **Specify Model Parameters:** Carefully configure model parameters like `temperature`, `maxOutputTokens`, and `topP` to control the output of the Gemini models.
- **Utilize Available Features:** Explore the specific features offered by the `@langchain/google-genai` integration, such as multimodal capabilities and function calling.
- **Handle Google Cloud Errors:** Implement error handling specifically for exceptions that may arise from interacting with Google Cloud services.
- **Monitor API Usage and Costs:** Be mindful of Google Cloud's pricing and monitor your API usage.
- **Keep Up-to-Date:** Stay informed about updates and new features in the `@langchain/google-genai` package and the underlying Gemini models.

### React

- **Component-Based Architecture:** Build your UI using reusable components for better organization, maintainability, and testability.
- **Follow React Principles:** Adhere to React's core principles of unidirectional data flow and declarative UI updates.
- **Manage State Effectively:** Choose the appropriate state management solution for your application's complexity (e.g., `useState`, `useReducer`, Context API, or external libraries like Zustand or Redux).
- **Optimize Performance:** Be mindful of performance bottlenecks and implement optimization techniques like memoization (`React.memo`, `useMemo`, `useCallback`), lazy loading, and code splitting.
- **Write Clean and Readable Code:** Follow consistent coding styles and conventions (e.g., using ESLint and Prettier).
- **Test Your Components:** Write unit, integration, and end-to-end tests to ensure the reliability of your React application.
- **Handle Side Effects Carefully:** Use `useEffect` appropriately to manage side effects like API calls and DOM manipulations. Clean up effects to prevent memory leaks.
- **Accessibility (A11y):** Build accessible UIs by using semantic HTML, providing proper ARIA attributes, and ensuring keyboard navigation.

### Tailwind CSS

- **Embrace Utility-First:** Leverage Tailwind's utility classes to style elements directly in your HTML or JSX.
- **Customize Your Configuration:** Tailor Tailwind's configuration file (`tailwind.config.js`) to match your project's design system, including colors, fonts, spacing, and breakpoints.
- **Use `@apply` Sparingly:** While `@apply` can be useful for extracting reusable styles, overuse can reduce the benefits of utility-first.
- **Organize Custom Styles:** If you need custom CSS, organize it logically in separate CSS files or within your component files.
- **Utilize Tailwind's Directives:** Understand and use Tailwind's directives like `@tailwind base`, `@tailwind components`, and `@tailwind utilities` in your CSS.
- **Be Mindful of Bundle Size:** Purge unused CSS classes in production to minimize your CSS bundle size. Configure PurgeCSS correctly in your `tailwind.config.js`.
- **Follow Naming Conventions:** Adhere to Tailwind's naming conventions for utility classes.

### Nanostores

- **Keep Stores Small and Focused:** Design your stores to manage specific pieces of application state.
- **Use Actions for Mutations:** Define actions to encapsulate state updates, making them predictable and easier to track.
- **Leverage Computed Stores:** Use computed stores (`computed()`) to derive new state values based on existing stores without manual updates.
- **Keep Subscriptions Minimal:** Subscribe to stores only in the components that need the data to avoid unnecessary re-renders.
- **Understand Store Scope:** Be aware of the scope of your stores (global vs. local) and choose accordingly.
- **Test Your Stores and Actions:** Write unit tests for your stores and actions to ensure their correct behavior.
- **Consider Performance:** Nanostores is designed for performance, but be mindful of complex computations within computed stores.

### PostgreSQL

- **Design a Well-Normalized Schema:** Create a database schema that minimizes data redundancy and ensures data integrity.
- **Use Appropriate Data Types:** Choose the correct data types for your columns to optimize storage and performance.
- **Define Indexes Strategically:** Create indexes on frequently queried columns to speed up data retrieval. Understand the trade-offs between index size and query performance.
- **Write Efficient SQL Queries:** Optimize your SQL queries by avoiding unnecessary joins, using `WHERE` clauses effectively, and understanding query execution plans.
- **Implement Transactions:** Use transactions to ensure atomicity, consistency, isolation, and durability (ACID properties) of database operations.
- **Secure Your Database:** Implement strong security measures, including password policies, access controls, and regular security audits.
- **Perform Regular Backups:** Implement a robust backup and recovery strategy to prevent data loss.
- **Monitor Database Performance:** Use monitoring tools to track database performance and identify potential bottlenecks.

### Drizzle

- **Define Your Schema Clearly:** Use Drizzle's schema definition to create a clear and type-safe representation of your database tables.
- **Leverage Type Safety:** Take advantage of Drizzle's strong type safety throughout your database interactions.
- **Use Prepared Statements:** Drizzle uses prepared statements by default, which helps prevent SQL injection vulnerabilities.
- **Utilize Drizzle ORM Features:** Explore Drizzle's ORM features for easier data querying and manipulation.
- **Understand Migrations:** Use Drizzle's migration system to manage database schema changes in a controlled and versioned manner.
- **Test Your Database Interactions:** Write tests for your database queries and operations to ensure they function correctly.
- **Optimize Queries with Drizzle:** Understand how Drizzle translates your queries to SQL and optimize your Drizzle code for performance.
- **Follow Drizzle's Documentation and Best Practices:** Stay updated with the latest features and recommendations from the Drizzle documentation.

## Rules

### General

1. Read the documents under `llms-txt` folder first.
1. If you can find the answer in the documents, use it.
1. Before coding, confirm the design with me first.
1. If you have any questions, ask me first.
1. If you are not sure about something, ask me first.

### Development

1. always use pnpm for installing packages.
1. always follow the linting rules defined in `biome.json`.
1. always use `// biome-ignore lint: <rule> <reason>` format.

### Styling

1. fetch the following links first:
    - <https://tailwindcss.com/docs/installation>

### Troubleshooting

1. If you could not find the root cause of a problem, try to search github issues first.