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

        // Create the reload button
        const reloadButton = document.createElement('button');
        reloadButton.id = 'reload-dropdown-button';
        reloadButton.style = `
            padding: 5px;
            border: none;
            background: none;
            cursor: pointer;
        `;
        reloadButton.innerHTML = '🔄'; // Unicode for reload symbol
        reloadButton.title = 'Reload positions'; // Tooltip for the button
        reloadButton.addEventListener('click', () => {
            populateDropdownWithPositions(positionDropdown); // Reload the dropdown
        });
        filterContainer.appendChild(reloadButton);

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

        filterContainer.appendChild(positionDropdown);


        // Create the filter button
        const filterButton = document.createElement('button');
        filterButton.id = 'position-filter-button';
        filterButton.textContent = 'Activate'; // Default text when dropdown is disabled
        filterButton.style = 'padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;';
        filterButton.addEventListener('click', () => {
            if (positionDropdown.disabled) {
                activatePositionField(); // Activate the "Position" member details
            } else {
                const position = positionDropdown.value.trim().toLowerCase();
                const count = filterByPosition(position);
                if (count < 0) {
                    return;
                }
                displayFilteredPosition(position, count);
                addRemoveFilterButton();
            }
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

function activatePositionField() {
    const dropdownToggle = document.querySelector('.participants-header-action .dropdown-toggle'); // Dropdown toggle button
    if (!dropdownToggle) {
        const positionDropdown = document.getElementById('position-filter-dropdown');
        const filterButton = document.getElementById('position-filter-button');
        if (positionDropdown && filterButton) {
            positionDropdown.disabled = false; // Enable the dropdown
            filterButton.textContent = 'Filter'; // Update button text
        }
        return;
    }

    // Open the dropdown menu
    dropdownToggle.click();

    setTimeout(() => {
        const positionOption = Array.from(document.querySelectorAll('.dropdown-menu a')).find(
            (option) => option.textContent.trim() === 'Position'
        );
        if (positionOption) {
            positionOption.click();
            console.log('Position field activated');

            // Enable the dropdown and update the button text
            const positionDropdown = document.getElementById('position-filter-dropdown');
            const filterButton = document.getElementById('position-filter-button');
            if (positionDropdown && filterButton) {
                positionDropdown.disabled = false; // Enable the dropdown
                filterButton.textContent = 'Filter'; // Update button text

                // Populate the dropdown with actual positions
                populateDropdownWithPositions(positionDropdown);
            }
        } else {
            console.error('Position option not found in the dropdown menu');
        }
    }, 500); // Adjust the timeout if needed
}

function populateDropdownWithPositions(positionDropdown) {
    // Clear existing options (except the default one)
    positionDropdown.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a position';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    positionDropdown.appendChild(defaultOption);

    // Extract unique positions from the recipients
    const people = document.querySelectorAll('li.recipients');
    const positionsSet = new Set();

    people.forEach((p) => {
        const subTitleDiv = p.querySelector('.sub-title'); // Assuming positions are in the "sub-title" div
        let posText = subTitleDiv?.textContent?.trim();
        if (posText) {
            // Remove "Position:" prefix if it exists
            posText = posText.replace(/^Position:\s*/i, ''); // Case-insensitive match for "Position:"
            positionsSet.add(posText); // Add the cleaned position to the set
        }
    });

    // Convert the set to an array and sort it alphabetically
    const sortedPositions = Array.from(positionsSet).sort((a, b) => a.localeCompare(b));

    // Populate the dropdown with sorted positions
    sortedPositions.forEach((position) => {
        const option = document.createElement('option');
        option.value = position.toLowerCase();
        option.textContent = position;
        positionDropdown.appendChild(option);
    });

    console.log('Dropdown populated with sorted positions:', sortedPositions);
}

function enableFilterIfPositionSelected() {
    const positionDropdown = document.getElementById('position-filter-dropdown');
    const filterButton = document.getElementById('position-filter-button');

    const positionFieldSelected = !!document.querySelector('.participants-remove-field'); // Check if the "Position" field is selected
    if (positionFieldSelected) {
        positionDropdown.disabled = false; // Enable the dropdown
        filterButton.textContent = 'Filter'; // Update button text
        return true; // Explicitly return true
    } else {
        positionDropdown.disabled = true; // Disable the dropdown
        filterButton.textContent = 'Activate'; // Update button text
        positionDropdown.value = ''; // Reset the dropdown
        return false; // Explicitly return false
    }
}
let recipientsPopupLoaded = false; // Flag to track if the Recipients popup is already loaded

function observeRecipientsPopup() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const memberCountDiv = document.querySelector('.member-count'); // Check for the unique element in the popup
                if (memberCountDiv && !recipientsPopupLoaded) {
                    console.log('Recipients popup detected. Adding filter UI...');
                    recipientsPopupLoaded = true; // Set the flag to true
                    addPositionFilterUI();
                    enableFilterIfPositionSelected(); // Check if the filter should be enabled
                } else if (!memberCountDiv && recipientsPopupLoaded) {
                    console.log('Recipients popup closed. Resetting state...');
                    recipientsPopupLoaded = false; // Reset the flag when the popup is closed
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
    var isEnabled = enableFilterIfPositionSelected();
    console.log(`Filter enabled: ${isEnabled}`); // Debugging log
    if (!isEnabled) {
        return -1;
    }
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