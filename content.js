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

    // Show feedback
    const button = document.querySelector('.gh-copy-button');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<button data-component="IconButton" type="button" class="prc-Button-ButtonBase-c50BI color-fg-success prc-Button-IconButton-szpyj" data-loading="false" data-no-visuals="true" data-size="medium" data-variant="invisible" aria-describedby=":r9:-loading-announcement" aria-labelledby=":r7:"><svg aria-hidden="true" focusable="false" class="octicon octicon-check" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align: text-bottom;"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path></svg></button>'
    setTimeout(() => {
      button.innerHTML = originalHTML;
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
if (window.location.href.match(/github\.com\/.*\/.*\/pull\/\d+/)) {
  createCopyButton();
}

// Watch for navigation changes (for single page app navigation)
const observer = new MutationObserver((mutations) => {
  // More specific check for PR pages using regex
  if (window.location.href.match(/github\.com\/.*\/.*\/pull\/\d+/)) {
    createCopyButton();
  }
});

// Only observe if we're on github.com
if (window.location.hostname === 'github.com') {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} 