if (typeof browser === 'undefined') {
  var browser = chrome;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed'); // Debugging log

  const filterButton = document.getElementById('filterBtn');
  const positionInput = document.getElementById('pos');

  if (!filterButton || !positionInput) {
    console.error('Filter button or position input not found in the DOM');
    return;
  }

  filterButton.addEventListener('click', () => {
    console.log('Filter button clicked'); // Debugging log
    const position = positionInput.value.trim().toLowerCase();
    console.log(`Position entered: "${position}"`); // Debugging log

    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        browser.tabs.sendMessage(activeTab.id, { type: 'FILTER_BY_POSITION', position }, (response) => {
          if (response?.success) {
            console.log('Filter applied successfully'); // Debugging log
          } else {
            console.error('Failed to apply filter'); // Debugging log
          }
        });
      }
    });
  });
});