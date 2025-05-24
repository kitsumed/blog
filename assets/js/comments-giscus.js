getGiscusTheme = () => {
    const themeStatus = localStorage.getItem("pref-theme")
    let dataThemeAuto = "preferred_color_scheme",
        dataThemeLight = "light",
        dataThemeDark = "dark",
        giscusTheme = dataThemeAuto
      
    if (themeStatus === undefined || themeStatus === "auto") {
      giscusTheme = dataThemeAuto
    } else if (themeStatus === "light") {
      giscusTheme = dataThemeLight
    } else if (themeStatus === "dark") {
      giscusTheme = dataThemeDark
    }
    return giscusTheme
  }
  
  getLanguage = () => {
    // Get the language from the HTML document
    const lang = document.documentElement.getAttribute("lang") || "en" // Default to 'en'
    return lang
  }
  
  // Refresh giscus theme and language
  updateGiscusConfig = () => {
    function sendMessage(message) {
      const iframe = document.querySelector('iframe.giscus-frame')
      if (!iframe) return
      iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app')
    }
    sendMessage({
      setConfig: {
        theme: getGiscusTheme(),
        lang: getLanguage(),
      },
    })
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const giscusAttributes = {
      "src": "https://giscus.app/client.js",
      "data-repo": "kitsumed/blog",
      "data-repo-id": "R_kgDOOv0Lnw",
      "data-category": "Blog Comments",
      "data-category-id": "DIC_kwDOOv0Ln84CqiyG",
      "data-mapping": "pathname",
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": getGiscusTheme(),
      "data-lang": getLanguage(),
      "crossorigin": "anonymous",
      "data-loading": "lazy",
      "async": "",
    }
  
    // Dynamically create script tag
    const giscusScript = document.createElement("script")
    Object.entries(giscusAttributes).forEach(([key, value]) => giscusScript.setAttribute(key, value))
    let divToAdd = document.getElementById('giscus-comments')
  
    // Inject script when user clicks the `details` element
    let detailsGiscus = document.getElementById('data-comments'),
        commentsLegend = document.getElementById('legend-comments')
    detailsGiscus.addEventListener("toggle", toggleDetails)
  
    function toggleDetails() {
      divToAdd.appendChild(giscusScript)
      if (commentsLegend.innerHTML === 'Show Comments') {
        commentsLegend.innerHTML = 'Hide Comments'
      } else {
        commentsLegend.innerHTML = 'Show Comments'
      }
    }
  
    // Update giscus theme when theme switcher is clicked
    const buttonChangeTheme = document.getElementById("theme-toggle")
    buttonChangeTheme.addEventListener('click', updateGiscusConfig)
  })
  