# Sinatra Supabase Edge Functions

This repository contains an edge function named `analyze`, built for Supabase Edge Runtime using Deno. The function integrates with the [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/about) to analyze a webpage's performance, accessibility, best practices, and SEO metrics.

## Features

- Validates input using [Zod](https://github.com/colinhacks/zod).
- Supports dynamic client-specific Google API keys.
- Fetches results for configurable categories (performance, accessibility, best practices, SEO).
- Returns structured JSON responses for easy integration with dashboards or other tools.

---

## Setup

### Prerequisites

1. [Supabase CLI](https://supabase.com/docs/guides/cli) installed on your machine.
2. A valid [Google API Key](https://cloud.google.com/docs/authentication/api-keys) with access to the PageSpeed Insights API.
3. Deno 2.0+ installed.

### Deploying the Function

1. Clone this repository:
   ```bash
   git clone https://github.com/polysharp/sinatra-edge-functions.git
   cd sinatra-edge-functions
   ```

2. Deploy the function to your Supabase project:
    ```bash
    supabase functions deploy
    ```
3. Test the function locally:
    ```bash
    supabase functions serve
    ```

## API Usage

### Endpoint
`https://<your-project>.functions.supabase.co/functions/v1/<your-function>`

### HTTP Method
`POST`

### Request Body
The request body should be a JSON object with the following fields:

| Field      | Type      | Required | Description                                                                                      |
|------------|-----------|----------|--------------------------------------------------------------------------------------------------|
| url        | string    | Yes      | The URL of the webpage to analyze (must be a valid URL).                                         |
| apiKey     | string    | Yes      | The Google API key for accessing the PageSpeed Insights API.                                     |
| categories | string[]  | No       | An array of categories to analyze. Default: `["performance", "accessibility", "best-practices", "seo"]`. |

#### Example Request:
```json
    {
        "url": "https://www.example.com",
        "apiKey": "your-google-api-key",
        "categories": ["performance", "seo"]
    }
```