import { qsAll } from './helpers'
import buttonHtml from './handlebars/templates/copy-button.html'

/** @type {HTMLButtonElement} */
let buttonTemplate

/**
 * Initializes copy buttons.
 */

window.addEventListener('swup:page:view', initialize)
initialize()

function initialize () {
  if (!('clipboard' in navigator)) return

  qsAll('pre:has(> code:first-child):not(:has(.copy-button))').forEach(pre => {
    if (!buttonTemplate) {
      const div = document.createElement('div')
      div.innerHTML = buttonHtml
      buttonTemplate = div.firstChild
    }

    const button = buttonTemplate.cloneNode(true)
    pre.appendChild(button)

    let timeout
    button.addEventListener('click', () => {
      const ariaLiveContent = button.querySelector('[aria-live]')
      clearTimeout(timeout)

      const text =
        Array.from(pre.querySelectorAll('code > *:not(.unselectable)'))
          .map(elem => elem.textContent)
          .join('')

      navigator.clipboard.writeText(text)
      button.classList.add('clicked')
      ariaLiveContent.innerHTML = 'Copied! &#x2713;'
      timeout = setTimeout(() => {
        button.classList.remove('clicked')
        ariaLiveContent.innerHTML = ''
      }, 3000)
    })
  })
}
