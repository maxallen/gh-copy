function createCopyButton() {
  // Create button element
  const button = document.createElement('button');
  button.textContent = 'Copy PR Info';
  button.className = 'btn btn-sm';
  button.style.marginLeft = '8px';

  // Add click handler
  button.addEventListener('click', copyPRInfo);

  // Insert button next to PR title
  const titleContainer = document.querySelector('.gh-header-title');
  if (titleContainer) {
    titleContainer.appendChild(button);
  }
}

function copyPRInfo() {
  // Get PR title
  const title = document.querySelector('.gh-header-title .js-issue-title').textContent.trim();
  
  // Get repo name
  const repoName = window.location.pathname.split('/').slice(1, 3).join('/');
  
  // Get PR URL
  const prUrl = window.location.href;
  
  // Get changes stats
  const statsElement = document.querySelector('.diffstat');
  const addedLines = statsElement.querySelector('.color-fg-success').textContent.trim();
  const deletedLines = statsElement.querySelector('.color-fg-danger').textContent.trim();

  // Create text snippet in requested format
  const textSnippet = `<a href="${prUrl}">${title}</a> (${repoName} ${addedLines}/${deletedLines})`;

  // Copy to clipboard
  navigator.clipboard.writeText(textSnippet, {type: 'text/html'}).then(() => {
    // Show feedback
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
}

// Run when page loads
createCopyButton();

// Watch for navigation changes (for single page app navigation)
const observer = new MutationObserver((mutations) => {
  if (window.location.href.includes('/pull/')) {
    createCopyButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
}); 