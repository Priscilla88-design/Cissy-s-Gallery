# Security Specification for Moments App

## Data Invariants
1. A photo must have a valid `userId` matching the creator.
2. An album must have a valid `userId` matching the creator.
3. Users can only read, write, and delete their own photos and albums.
4. Photos and albums must have a `createdAt` timestamp.

## The Dirty Dozen Payloads (Target: PERMISSION_DENIED)

1. **Identity Spoofing (Create Photo)**: Attempting to create a photo with another user's `userId`.
   ```json
   { "url": "...", "title": "Spoof", "userId": "victim_id", "createdAt": 123 }
   ```
2. **Ghost Field (Create Album)**: Adding an unauthorized field to an album.
   ```json
   { "name": "Hack", "userId": "my_id", "createdAt": 123, "isAdmin": true }
   ```
3. **Malicious Link (Create Photo)**: Extremely long URL (denial of wallet).
   ```json
   { "url": "a".repeat(2000), "title": "Long URL", "userId": "my_id", "createdAt": 123 }
   ```
4. **Unauthorized Update (Photo)**: Trying to change the `userId` of an existing photo.
   ```json
   { "userId": "attacker_id" }
   ```
5. **Unauthorized Delete (Album)**: Trying to delete an album that belongs to another user.
6. **Cross-User Read (Photo)**: Accessing a photo document ID that belongs to another user.
7. **Cross-User List (Albums)**: Querying albums without a userId filter matching the auth uid.
8. **Invalid Type (Photo)**: Setting `createdAt` to a string instead of a number.
   ```json
   { "url": "...", "title": "...", "userId": "my_id", "createdAt": "not_a_time" }
   ```
9. **Missing Required Field (Album)**: Creating an album without a `name`.
   ```json
   { "userId": "my_id", "createdAt": 123 }
   ```
10. **Shadow Update (Photo)**: Modifying an immutable field like `createdAt`.
    ```json
    { "createdAt": 99999 }
    ```
11. **Path Poisoning**: Using a document ID with malicious characters.
12. **Public Read Attempt**: Trying to read photos without being signed in.

## Test Strategy
The `firestore.rules` will be built to specifically block these patterns using `isValidPhoto`, `isValidAlbum`, and ownership checks.
