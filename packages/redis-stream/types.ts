export interface WebsiteMessage {
  url: string;
  id: string; // This is typically the website_id (UUID or similar)
}

// 2. Defines the structure of a single entry fetched from the Redis Stream.
export interface StreamEntry {
  id: string; // The stream message ID (e.g., "1760648155904-0")
  message: WebsiteMessage; // The data payload
}

// 3. Defines the structure of the *entire* raw response from redisClient.xReadGroup.
// This is what your 'res' variable initially holds in xREAD_GROUP.
export interface RedisStreamResponse {
  name: string; // The stream key name (e.g., "neverdown:websites")
  messages: StreamEntry[]; // An array of the actual messages
}