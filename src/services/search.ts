
'use server';
/**
 * @fileOverview A service for interacting with Vertex AI Search.
 *
 * - searchResources - A function to search for wellness resources.
 */

import { SearchServiceClient } from '@google-cloud/discoveryengine';
import type { Resource, ResourceType } from '@/types';

// IMPORTANT: Update these values with your actual Vertex AI Search configuration.
const GCLOUD_PROJECT_ID = 'aarambhai-youth-wellness';
const GCLOUD_LOCATION = 'global'; // e.g., 'global' or 'us'
const DATA_STORE_ID = 'aarambhai-resources_1721203923393'; // The ID of your data store

if (!GCLOUD_PROJECT_ID || !DATA_STORE_ID) {
  console.warn('Vertex AI Search environment variables are not set.');
}

const searchClient = new SearchServiceClient();

/**
 * Searches for relevant wellness resources using Vertex AI Search.
 * @param query The user's search query.
 * @returns A promise that resolves to an array of Resource objects.
 */
export async function searchResources(query: string): Promise<Resource[]> {
  if (!GCLOUD_PROJECT_ID || !DATA_STORE_ID) {
    console.error('Vertex AI Search is not configured. Returning empty array.');
    return [];
  }

  const servingConfig = searchClient.projectLocationDataStoreServingConfigPath(
    GCLOUD_PROJECT_ID,
    GCLOUD_LOCATION,
    DATA_STORE_ID,
    'default_config' // Usually 'default_config'
  );

  try {
    const [response] = await searchClient.search({
      servingConfig,
      query,
      pageSize: 10,
    });

    if (!response.results) {
      return [];
    }
    
    // Transform the search results into the application's Resource format.
    const resources: Resource[] = response.results
        .map((result) => {
            const doc = result.document?.derivedStructData?.fields;
            if (!doc) return null;

            // Extract fields, assuming they are named 'title', 'description', 'link', and 'type'.
            // Your field names in Vertex AI Search might be different.
            const title = doc.title?.stringValue;
            const description = doc.description?.stringValue;
            const link = doc.link?.stringValue;
            const type = doc.type?.stringValue as ResourceType;

            if (!title || !description || !link || !type) {
                return null;
            }

            return { title, description, link, type };
        })
        .filter((r): r is Resource => r !== null); // Filter out any null results

    return resources;
  } catch (error) {
    console.error('Error calling Vertex AI Search:', error);
    // In case of an error, return an empty array to prevent crashing the app.
    return [];
  }
}
