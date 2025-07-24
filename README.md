# Upload Widget Server - Node.js Overview

This repository contains an upload server built with Node.js that provides image upload functionality through a REST API.

## Project Structure and Technology Stack

This is a TypeScript-based upload server using the Fastify web framework [1](#0-0) . The project uses a modular architecture with separate layers for infrastructure, application logic, and database management.

## Core Functionality

The server provides a single main endpoint /uploads that accepts multipart file uploads [2](#0-1) . It implements file size restrictions with a 2MB limit [3](#0-2)  and validates file types to only accept specific image formats: JPG, JPEG, PNG, and WebP [4](#0-3) .

## Database Integration

The server uses PostgreSQL as its database [5](#0-4)  with Drizzle ORM for database operations [6](#0-5) . The uploads table stores file metadata including name, remote key, remote URL, and creation timestamp [7](#0-6) , using UUID v7 for primary keys [8](#0-7) .

## API Documentation and Validation

The server includes Swagger/OpenAPI documentation accessible at /docs [9](#0-8)  with the API titled "Upload Server" [10](#0-9) . Input validation is handled using Zod schemas [11](#0-10)  with proper error handling for validation failures [12](#0-11) .

## Development Setup

The server runs on port 3333 [13](#0-12)  and includes CORS support for all origins [14](#0-13) . The project includes development scripts for running the server with hot reload [15](#0-14) , testing with Vitest [16](#0-15) , and database management with Drizzle migrations [17](#0-16) .

## Current Status

The project appears to be in development with a TODO comment indicating plans to integrate Cloudflare R2 for file storage [18](#0-17) . Currently, uploaded files are validated and their metadata is stored in the database, but actual file storage implementation is pending.

## Notes

This server is designed as a backend component for an upload widget, providing the server-side functionality to handle file uploads with proper validation, database storage, and API documentation. The modular architecture makes it easy to extend and maintain, and the use of modern TypeScript tooling ensures type safety throughout the application.