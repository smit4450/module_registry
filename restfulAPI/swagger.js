// Import swagger-jsdoc using ES module syntax
import swaggerJSDoc from "swagger-jsdoc";

// Define the Swagger options for the API documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Package Registry API",
      version: "1.0.0",
      description: "API for managing package uploads, downloads, updates, and ratings",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to API route definitions for Swagger
};

// Generate the Swagger documentation based on the options
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Export the generated Swagger documentation as the default export
export default swaggerDocs;
