const DEV_HOSTNAME = 'localhost'

// TODO: 根据真实业务规则修改代理端口
function getPort(https) {
  // https 的走反代后的端口
  if (https) {
    if (window.location.pathname.startsWith('/foo')) {
      return '4001'
    }
    return '4002'
  }
  if (window.location.pathname.startsWith('/foo')) {
    return '3001'
  }
  return '3002'
}

function getOrigin(https) {
  return `http${https ? 's' : ''}://${DEV_HOSTNAME}:${getPort(https)}`
}

function setupDevPort(https) {
  window.__DEV_HMR_HOSTNAME = DEV_HOSTNAME
  window.__DEV_HMR_PORT__ = getPort(https)
}

function appendViteScript(https) {
  const viteClientScript = document.createElement('script')
  viteClientScript.type = 'module'
  viteClientScript.src = `${getOrigin(https)}/@vite/client`

  const refreshRuntimeScript = document.createElement('script')
  refreshRuntimeScript.type = 'module'
  refreshRuntimeScript.textContent = `
  import RefreshRuntime from "${getOrigin(https)}/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
  `

  document.head.appendChild(viteClientScript)
  document.head.appendChild(refreshRuntimeScript)
}

function appendEntry(https) {
  const entryScript = document.createElement('script')
  entryScript.type = 'module'
  entryScript.src = `${getOrigin(https)}/src/main.tsx`
  document.body.appendChild(entryScript)
}

setupDevPort(true)
appendViteScript(true)
appendEntry(true)
