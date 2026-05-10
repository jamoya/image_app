# Technical Specification: AI Virtual Try-On Interface

## 1. Project Overview
Build a single-page React application that allows users to upload two images, sends them to a local n8n webhook as binary data, and displays the resulting binary image returned by the server.

## 2. Tech Stack
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS, reproducing this style @Captura de pantalla 2026-05-03 a las 10.07.05.png
*   **Icons:** Lucide-react
*   **HTTP Client:** Axios (preferred for binary handling)

## 3. UI Components & Layout
The UI should be modern, dark-themed (AI-style), and responsive.

### A. Header
*   Title: "AI Image Blender"
*   Subtitle: "Virtual Try-On Studio"

### B. Upload Section (Two Columns)
*   **Slot 1 (image1):** Label "Base Person / Model". Drag-and-drop zone.
*   **Slot 2 (image2):** Label "Garment / Clothing". Drag-and-drop zone.
*   **Requirements:** Show a thumbnail preview once a file is selected. Clear button to remove the image.

### C. Action Area
*   **"Generate" Button:** Full-width button. 
    *   **Disabled state:** If image1 or image2 is missing.
    *   **Loading state:** Show a spinner and change text to "Processing AI..." when the request is in flight.

### D. Result Display
*   A large placeholder area that says "Generated Result will appear here."
*   Once the response is received, display the returned image.
*   Provide a "Download Result" button below the output.

## 4. API Implementation (The Webhook)
This is the critical functional part of the app.

*   **Endpoint:** `http://localhost:5678/webhook/883e1430-0a60-46e2-9e28-0978cb8ffc41`
*   **Method:** `POST`
*   **Payload Type:** `multipart/form-data`
*   **Payload Keys:**
    *   `image1`: (File object/Binary)
    *   `image2`: (File object/Binary)

### Binary Handling Logic:
1.  **Request:** Use `FormData` to append the two files.
2.  **Response:** The response from n8n will be a binary file (image/jpeg or image/webp). 
3.  **Handling:** Set `responseType: 'blob'` in the Axios request.
4.  **Display:** Convert the returned blob to a local URL using `URL.createObjectURL(blob)` and set it as the `src` of the result image tag.

## 5. Styling Guidelines (The "Screenshot" Look)
*   **Background:** Deep Dark Gray/Black (`#0a0a0a`).
*   **Cards:** Slightly lighter gray (`#1a1a1a`) with a 1px border (`#333`).
*   **Border Radius:** `rounded-2xl` (16px).
*   **Primary Accent:** Gradient button (e.g., `from-blue-600 to-purple-600`).
*   **Animations:** Use a simple pulse animation on the result card while loading.

## 6. Implementation Steps for the Agent
1.  **Setup:** Initialize a React project with Tailwind CSS.
2.  **State:** Create state variables for `image1`, `image2`, `resultImage` (the blob URL), and `loading` (boolean).
3.  **Upload Logic:** Create a reusable `ImageUpload` component that handles file selection and creates a local preview URL.
4.  **Submission Logic:** 
    *   Construct the `FormData`.
    *   Trigger the `POST` request to the n8n localhost URL.
    *   Handle the binary response and create an object URL.
    *   Implement error handling (toast notification) if the webhook fails.
5.  **Refinement:** Add a "Download" function that creates a temporary link to save the generated blob.

## 7. Expected Error Handling
*   If the user tries to click Generate without two images, show a validation message.
*   If n8n is not running (Connection Refused), show a message: "Ensure your local n8n instance is running on port 5678."
