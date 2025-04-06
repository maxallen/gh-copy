function copyPRInfo() {
  // Get PR Info
  const title = document.querySelector('.gh-header-title .js-issue-title').textContent.trim();
  const repoName = window.location.pathname.split('/').slice(2, 3).join('/');
  const prUrl = window.location.href;
  
  // Get line changes stats
  const statsElement = document.querySelector('.diffstat');
  const addedLines = statsElement.querySelector('.color-fg-success').textContent.trim();
  const deletedLines = statsElement.querySelector('.color-fg-danger').textContent.trim();

  const textSnippet = `<a href="${prUrl}">${title}</a> (${repoName} ${addedLines}/${deletedLines})`;
  const tempElement = document.createElement('div');
  tempElement.innerHTML = textSnippet;

  // Copy to clipboard
  navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([tempElement.innerHTML], { type: 'text/html' }),
      'text/plain': new Blob([tempElement.textContent], { type: 'text/plain' })
    })
  ]).then(() => {
    // Remove the temp element
    tempElement.remove();

    // Log to console
    console.log("PR info copied!");

    // Create and show toast notification
    const toast = document.createElement('div');
    toast.textContent = "PR info copied!";
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#2ea44f';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '6px';
    toast.style.zIndex = '9999';
    toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    document.body.appendChild(toast);
    
    // Remove toast after 1 second
    setTimeout(() => {
      toast.remove();
    }, 1000);
  });
}

function createCopyButton() {
  // Check if we're on a PR page first
  if (!window.location.href.match(/github\.com\/.*\/.*\/pull\/\d+/)) {
    return;
  }

  // Create button if it doesn't exist
  if (document.querySelector('.gh-copy-button')) {
    return;
  }
  const button = document.createElement('button');
  button.innerHTML = '<svg aria-hidden="true" focusable="false" class="octicon octicon-copy" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>'
//   button.textContent = 'Copy PR Info';
  button.className = 'prc-Button-ButtonBase-c50BI prc-Button-IconButton-szpyj gh-copy-button';
  button.style.marginLeft = '8px';
  button.addEventListener('click', copyPRInfo);

  
  // Insert button next to PR title
  const titleContainer = document.querySelector('.gh-header-title');
  if (titleContainer) {
    titleContainer.appendChild(button);
  }
}

// Run when page loads
createCopyButton();
  
// Also listen for CMD+Shift+o
document.addEventListener('keydown', (event) => {
  console.log("keydown event", event);
  // Check if CMD+Shift+o is pressed (metaKey is CMD on Mac, Ctrl on Windows)
  if (event.metaKey && event.shiftKey && event.key === 'o') {
    console.log("CMD+Shift+o pressed", event);
    event.preventDefault();
    copyPRInfo();
  }
});

// Watch for navigation changes (for single page app navigation)
const observer = new MutationObserver((mutations) => {
  createCopyButton();
});

// Only observe if we're on github.com
if (window.location.hostname === 'github.com') {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} 