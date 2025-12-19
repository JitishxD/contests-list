# Contests List — Chrome Extension

**Contests List** is a browser extension that helps competitive programmers track upcoming contests from various platforms like Codeforces, LeetCode, AtCoder, and more. It fetches real-time data using the **Clist.by API**.

## Features

- 📅 **Upcoming Contests**: View a list of contests happening today and in the near future.
- 🔍 **Filters**: Filter contests by platform (e.g., only Codeforces) or time range.
- ⚡ **Fast Access**: Quick popup view right from your browser toolbar.
- ⚙️ **Customizable**: Configure your preferred platforms and settings.

## Installation

You can install the extension directly from the Chrome Web Store:

<a href="#">
    <picture>
      <source srcset="public/chromeWebStoreDarkBg.png" media="(prefers-color-scheme: dark)">
      <img height="58" src="public/chromeWebStoreLightBg.png" alt="Chrome Web Store">
    </picture>
</a>

Or you can build the extension from source see [here](#setup--build)

## Getting Started

To use this extension, you need to configure it with a free API key from Clist.by.

1.  **Get API Credentials**:
    - Go to [clist.by/api/v4/doc/](https://clist.by/api/v4/doc/)
    - Log in or sign up.
    - Copy your **Username** and **API Key**.

2.  **Configure Extension**:
    - Right-click the extension icon in your browser toolbar and select **Options**.
    - Enter your **Clist Username** and **API Key**.
    - Click **Save**.

3.  **Done!** Click the extension icon to see the contests.

## Usage

- **Popup**: Click the icon to see the list. Use the "Filter" button to select specific platforms or toggle between "Today" and "Upcoming".
- **Refresh**: The data is cached for 12 hours to save bandwidth. Click the refresh icon to force an update.
- **Data Management**: In the Options page, you can export or import your settings if you move to a new computer.

---

# Developer Guide

This section is for developers who want to contribute or build the extension from source.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Build Tool**: `@crxjs/vite-plugin` (MV3)

## Project Structure

- `src/manifest.js`: Extension manifest configuration.
- `src/popup/`: Main popup UI (React).
- `src/options/`: Options page UI (React).
- `src/background/`: Service worker.
- `src/contentScript/`: Content scripts.

## Setup & Build

1.  **Clone the Repository**:

    ```sh
    git clone https://github.com/JitishxD/contests-list.git
    cd contests-list
    ```

2.  **Install Dependencies**:

    ```sh
    npm install
    ```

3.  **Development Mode** (Hot Reload):

    ```sh
    npm run dev
    ```

    - This will generate a `build/` folder.
    - Load this folder in Chrome via "Load Unpacked".

4.  **Production Build**:

    ```sh
    npm run build
    ```

5.  **Package for Store**:

    ```sh
    npm run zip
    ```

    - Creates a versioned zip file in `package/`.

## Loading in Chrome (Developer Mode)

1.  Open `chrome://extensions`
2.  Enable **Developer mode** (top right toggle).
3.  Click **Load unpacked**.
4.  Select the `build/` directory created by the build command.
