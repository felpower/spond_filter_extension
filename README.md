# Spond Position Filter

The **Spond Position Filter** is a Chrome extension that enhances the Spond platform by allowing users to filter recipients based on their position. This extension provides an intuitive dropdown-based filtering UI directly on the Spond page, making it easier to manage and find relevant recipients.

---

## Features

- **Dropdown-Based Filtering**: Select a position from a predefined dropdown list (e.g., QB, OL, WR, DL, RB, LB) to filter recipients.
- **Dynamic UI Integration**: The filtering UI is seamlessly integrated into the Spond page.
- **Enable/Disable Logic**: The filter dropdown and button are enabled only when the "Position" field is selected in the Spond member details.
- **Reset Functionality**: Easily remove the applied filter and reset the dropdown with a single click.

---

## Installation

1. **Download the Extension**:
   - Clone or download this repository to your local machine.

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** (toggle in the top-right corner).
   - Click **Load unpacked** and select the folder containing the extension files.

3. **Start Using the Extension**:
   - Open the Spond website.
   - Use the filtering UI added to the page to filter recipients by position.

---

## Usage

1. **Open the Recipients Popup**:
   - Navigate to the Spond page and open the recipients popup.

2. **Select a Position**:
   - Use the dropdown to select a position (e.g., QB, WR, DL).

3. **Apply the Filter**:
   - Click the "Filter" button to filter recipients based on the selected position.

4. **Remove the Filter**:
   - Click the "Remove Filter" button to reset the filter and show all recipients.

---

## Permissions

This extension requires the following permissions:

- **`activeTab`**: To interact with the currently active tab where the Spond website is open.
- **Host Permission (`*://*.spond.com/*`)**: To inject the content script and add the filtering UI to the Spond page.

---

## Privacy Policy

The Spond Position Filter extension does not collect, store, or process any personal data from users. All operations are performed locally within the user's browser. For more details, refer to the [Privacy Policy](helper/privacy_extension.html).

---

## Development

### Prerequisites

- Chrome browser
- Basic knowledge of JavaScript and Chrome extensions

### File Structure

- **`manifest.json`**: Defines the extension's metadata and permissions.
- **`content.js`**: Injects the filtering UI and handles filtering logic.
- **`popup.html`**: Displays a message indicating the filter is available directly on the Spond page.
- **`popup.js`**: Handles popup-related logic (currently minimal).
- **`helper/privacy_extension.html`**: Contains the privacy policy for the extension.

### How to Modify

1. Update the predefined positions in `content.js` under the `positions` array.
2. Customize the UI styles in the `addPositionFilterUI` function.

---

## Known Issues

- The filter dropdown and button are disabled until the "Position" field is selected in the Spond member details.
- The extension is designed specifically for the Spond platform and may not work on other websites.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions or support, please contact:

- **Email**: [info@felpower-software.com](mailto:info@felpower-software.com)
