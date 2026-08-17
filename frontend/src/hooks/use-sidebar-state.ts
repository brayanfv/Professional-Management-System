"use client"

import { useCallback, useSyncExternalStore } from "react"

const SIDEBAR_STORAGE_KEY = "professional-management-sidebar"
const SIDEBAR_CHANGE_EVENT = "professional-management-sidebar-change"

export type SidebarState = "expanded" | "collapsed"

function getSidebarState(): SidebarState {
  const storedState = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
  return storedState === "collapsed" ? "collapsed" : "expanded"
}

function getServerSidebarState(): SidebarState {
  return "expanded"
}

function subscribeToSidebarState(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) {
      onStoreChange()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(SIDEBAR_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(SIDEBAR_CHANGE_EVENT, onStoreChange)
  }
}

export function useSidebarState() {
  const state = useSyncExternalStore(
    subscribeToSidebarState,
    getSidebarState,
    getServerSidebarState,
  )

  const toggle = useCallback(() => {
    const nextState =
      getSidebarState() === "expanded" ? "collapsed" : "expanded"

    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, nextState)
    window.dispatchEvent(new Event(SIDEBAR_CHANGE_EVENT))
  }, [])

  return {
    collapsed: state === "collapsed",
    state,
    toggle,
  }
}
