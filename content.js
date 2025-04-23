console.log('Spond Position Filter script loaded'); // Debugging log
function addPositionFilterUI() {
    const popupHeader = document.querySelector('.modal-header'); // Replace with the actual top container class
    if (!popupHeader) {
        console.log('Popup header not found. Filter UI will not be added.');
        return; // Exit if the top container is not found
    }

    // Ensure the modal header uses flexbox for alignment
    popupHeader.style.display = 'flex';
    popupHeader.style.alignItems = 'center';
    popupHeader.style.justifyContent = 'space-between';

    // Check if the filter UI already exists
    let filterContainer = document.getElementById('position-filter-container');
    if (!filterContainer) {
        // Create a container for the filter UI
        filterContainer = document.createElement('div');
        filterContainer.id = 'position-filter-container';
        filterContainer.style = `
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: nowrap; /* Ensure everything stays on one line */
            margin-left: auto; /* Push the filter UI to the right of the modal title */
        `;

        // Create the dropdown field
        const positionDropdown = document.createElement('select');
        positionDropdown.id = 'position-filter-dropdown';
        positionDropdown.style = 'padding: 5px; border: 1px solid #ccc; border-radius: 4px;';
        positionDropdown.disabled = true; // Disable the dropdown by default

        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a position';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        positionDropdown.appendChild(defaultOption);

        // Add predefined positions
        const positions = ['QB', 'WR', 'DL', 'RB', 'LB']; // Add more positions as needed
        positions.forEach((position) => {
            const option = document.createElement('option');
            option.value = position.toLowerCase();
            option.textContent = position;
            positionDropdown.appendChild(option);
        });

        filterContainer.appendChild(positionDropdown);

        // Create the filter button
        const filterButton = document.createElement('button');
        filterButton.id = 'position-filter-button';
        filterButton.textContent = 'Filter';
        filterButton.style = 'padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;';
        filterButton.disabled = true; // Disable the button by default
        filterButton.addEventListener('click', () => {
            const position = positionDropdown.value.trim().toLowerCase();
            const count = filterByPosition(position);
            displayFilteredPosition(position, count);
            addRemoveFilterButton();
        });
        filterContainer.appendChild(filterButton);

        // Create the filtered position display
        const positionDisplay = document.createElement('div');
        positionDisplay.id = 'filtered-position-display';
        positionDisplay.style = `
            padding: 5px 10px;
            background-color: rgb(191, 173, 255);
            color: black;
            border: none;
            cursor: default;
        `;
        positionDisplay.textContent = 'No filter'; // Default text
        filterContainer.appendChild(positionDisplay);

        // Create the "Remove Filter" button
        const removeFilterButton = document.createElement('button');
        removeFilterButton.id = 'remove-filter-button';
        removeFilterButton.textContent = 'Remove Filter';
        removeFilterButton.style = `
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;
        removeFilterButton.addEventListener('click', () => {
            removeFilter();
        });
        filterContainer.appendChild(removeFilterButton);

        // Append the filter UI to the modal header
        popupHeader.appendChild(filterContainer);
    }
}

function enableFilterIfPositionSelected() {
    const positionDropdown = document.getElementById('position-filter-dropdown');
    const filterButton = document.getElementById('position-filter-button');

    const positionFieldSelected = !!document.querySelector('.participants-remove-field'); // Check if the "Position" field is selected
    if (positionFieldSelected) {
        positionDropdown.disabled = false; // Enable the dropdown
        filterButton.disabled = false; // Enable the filter button
    } else {
        positionDropdown.disabled = true; // Disable the dropdown
        filterButton.disabled = true; // Disable the filter button
        positionDropdown.value = ''; // Reset the dropdown
    }
}
function observeRecipientsPopup() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const memberCountDiv = document.querySelector('.member-count'); // Check for the unique element in the popup
                if (memberCountDiv) {
                    addPositionFilterUI();
                    enableFilterIfPositionSelected(); // Check if the filter should be enabled
                }
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
}

// Start observing when the script is loaded
observeRecipientsPopup();

function filterByPosition(position) {
    const people = document.querySelectorAll('li.recipients');

    let shown = 0;

    people.forEach((p) => {
        const subTitleDiv = p.querySelector('.sub-title');
        const posText = subTitleDiv?.textContent?.toLowerCase() || "";

        if (!position || posText.includes(position)) {
            p.style.display = "";
            shown++;
        } else {
            p.style.display = "none";
        }
    });

    console.log(`Shown: ${shown}, Total: ${people.length}`); // Debugging log
    return shown;
}

function displayFilteredPosition(position, count) {
    const positionDisplay = document.getElementById('filtered-position-display');
    if (!positionDisplay) {
        console.error('Filtered position display not found');
        return;
    }

    positionDisplay.textContent = position
        ? `${position.toUpperCase()} (${count})`
        : 'No filter';
}

function addRemoveFilterButton() {
    const popupHeader = document.querySelector('.modal-header'); // Replace with the actual top container class
    if (!popupHeader) {
        console.error('Popup header not found');
        return;
    }
    popupHeader.style.display = 'flex';
    popupHeader.style.alignItems = 'center';
    popupHeader.style.justifyContent = 'space-between'; // Ensure space between title and filter UI

    let removeFilterButton = document.getElementById('remove-filter-button');
    if (!removeFilterButton) {
        removeFilterButton = document.createElement('button');
        removeFilterButton.id = 'remove-filter-button';
        removeFilterButton.textContent = 'Remove Filter';
        removeFilterButton.style = `
            margin-left: 10px;
            padding: 5px 10px;
            background-color: #f44336;
            color: white;
            border: none;
            cursor: pointer;
        `;
        removeFilterButton.addEventListener('click', () => {
            removeFilter();
        });
        popupHeader.appendChild(removeFilterButton);
    }
}

function removeFilter() {
    const people = document.querySelectorAll('li.recipients');
    people.forEach((p) => {
        p.style.display = ""; // Show all recipients
    });

    // Reset the filtered position display
    const positionDisplay = document.getElementById('filtered-position-display');
    if (positionDisplay) {
        positionDisplay.textContent = 'No filter';
    }

    // Reset the dropdown
    const positionDropdown = document.getElementById('position-filter-dropdown');
    if (positionDropdown) {
        positionDropdown.value = ''; // Reset the dropdown
    }
}