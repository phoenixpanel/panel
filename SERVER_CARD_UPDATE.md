# Refactor Plan: Server Card Images in Eggs

## Overview

This document outlines the plan to refactor PhoenixPanel to support server card images within eggs, offering both URL and image upload options. The implementation will include two distinct display styles: background fill with gradient opacity and a small image with curved corners.

## 1. Information Gathering

*   Examine the `Egg` model and related database schema.
*   Identify the files responsible for rendering server cards.
*   Investigate existing image handling mechanisms.
*   Look at the `package.json` file for relevant image manipulation libraries.

## 2. Database Changes

*   Modify the `eggs` table to include two new columns:
    *   `image_url` (string): Stores the URL of the image.
    *   `image_upload` (string): Stores the path to the uploaded image.

## 3. Backend Logic

*   Update the `Egg` model to include the new image fields as attributes.
*   Implement accessors and mutators for the image fields to handle URL validation, file storage, and image processing.
*   Implement image upload logic, including file storage and path generation.

### Image Optimization

*   Resize uploaded images to a reasonable size (e.g., 500x500 pixels).
*   Compress images to reduce file size using libraries like Intervention Image or similar.
*   Generate thumbnails for faster loading in the admin panel.

### Storage

*   Determine the storage location for uploaded images (local or cloud).
*   Implement the storage logic using Laravel's filesystem integration.

## 4. API Changes

*   Modify the API endpoints for creating and updating eggs to accept the new image URL and file upload parameters.
*   Ensure that the API logic correctly handles both options and validates the input.

## 5. Frontend Changes

*   Modify the server card component to display the image based on the selected style.
*   Implement the UI for selecting the image display style and uploading/linking images within the egg creation/update forms.

## 6. Configuration

*   Add settings to control the default image display style and the size of the small image.

## 7. File Modifications List

*   `database/migrations/*_create_eggs_table.php`
*   `app/Models/Egg.php`
*   `app/Http/Controllers/Api/EggController.php` (or similar API controller)
*   `resources/views/admin/eggs/create.blade.php` (or similar view file)
*   `resources/views/components/server-card.blade.php` (or similar component file)
*   `config/phoenixpanel.php` (or similar configuration file)
*   Any relevant CSS/JS files for styling and UI interactions.

## Mermaid Diagram

```mermaid
graph TD
    A[Start] --> B{Database Changes};
    B --> C[Modify `eggs` table];
    C --> D[Add `image_url` and `image_upload` fields];
    D --> E{Backend Logic};
    E --> F[Update `Egg` model];
    F --> G[Add accessors/mutators for image fields];
    G --> H[Implement image upload logic];
    H --> I[Image Optimization];
    I --> J[Resize images to a reasonable size];
    J --> K[Compress images to reduce file size];
    K --> L[Generate thumbnails];
    L --> M[Storage];
    M --> N[Determine storage location (local or cloud)];
    N --> O[Implement storage logic];
    O --> P{API Changes};
    P --> Q[Modify API endpoints for egg creation/update];
    Q --> R[Accept image URL and file uploads];
    R --> S{Frontend Changes};
    S --> T[Modify server card component];
    T --> U[Add image display logic based on selected style];
    U --> V[Implement UI for selecting image style and uploading/linking images];
    V --> W{Configuration};
    W --> X[Add settings to control default image style and size];
    X --> Y{File Modifications List};
    Y --> Z[List all modified files];
    Z --> AA[End];