# Environment Variables Setup

This project uses environment variables to securely manage Firebase and Google Cloud configurations.

## Initial Setup

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with your actual Firebase project values:
   - Get these values from your Firebase Console > Project Settings > General
   - For the Google Cloud settings, get them from your Vertex AI Search configuration

3. **IMPORTANT**: Never commit `.env.local` to version control. It's already ignored in `.gitignore`.

## Required Environment Variables

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_APP_ID` - Your Firebase app ID  
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase messaging sender ID

### Google Cloud Configuration  
- `GCLOUD_PROJECT_ID` - Your Google Cloud project ID
- `GCLOUD_DATA_STORE_ID` - Your Vertex AI Search data store ID

## Security Best Practices

1. **Rotate API keys every 90 days**
2. **Use Firebase Security Rules** to restrict access
3. **Monitor usage** and set up billing alerts
4. **Use different projects** for dev/staging/production
5. **Enable 2FA** for all Firebase administrators

## Key Rotation Process

1. Go to Firebase Console > Project Settings > General
2. Generate a new Web API Key
3. Update `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`
4. Test the application thoroughly
5. Delete the old API key from Firebase Console