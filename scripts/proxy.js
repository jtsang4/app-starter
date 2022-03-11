function getPort() {
  return '4001'
}

function getOrigin(https) {
  return `http${https ? 's' : ''}://localhost:${getPort()}`
}

function setupDevPort() {
  window.__DEV_HMR_PORT__ = getPort()
}

function appendViteScript() {
  const viteClientScript = document.createElement('script')
  viteClientScript.type = 'module'
  viteClientScript.src = `${getOrigin(true)}/@vite/client`

  const refreshRuntimeScript = document.createElement('script')
  refreshRuntimeScript.type = 'module'
  refreshRuntimeScript.textContent = `
  import RefreshRuntime from "${getOrigin(true)}/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
  `

  document.head.appendChild(viteClientScript)
  document.head.appendChild(refreshRuntimeScript)
}

function appendEntry() {
  const entryScript = document.createElement('script')
  entryScript.type = 'module'
  entryScript.src = `${getOrigin(true)}/src/main.tsx`
  document.body.appendChild(entryScript)
}

setupDevPort()
appendViteScript()
appendEntry()
