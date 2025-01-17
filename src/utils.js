import * as React from 'react'
import moment from 'moment'
import getHistory from 'react-router-global-history'

export function byteSizeToString(size) {
  const bytesPerKB = 1000
  const bytesPerMB = bytesPerKB * 1000
  const bytesPerGB = bytesPerMB * 1000

  if (size < bytesPerKB) {
    return size + ' B'
  }
  else if (size < bytesPerMB) {
    return size/bytesPerKB + ' KB'
  }
  else if (size < bytesPerGB) {
    return size/bytesPerMB + ' MB'
  }
  else {
    return size/bytesPerGB + ' GB'
  }
}

export function timeDifferenceForDate(date) {
  const now = moment()
  const updated = moment(date)

  if (now.diff(updated, 'years') === 1) {
    return "on " + updated.format('MMM D, YYYY')
  } else if (now.diff(updated, 'days') === 0) {
    return updated.fromNow()
  } else {
    return "on " + updated.format('MMM Do')
  }
}

export function isNil(value) {
  return value === null || value === undefined
}

export function isDefined(value) {
  return !isNil(value)
}

export function isEmpty(value) {
  return value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && !Object.keys(value).length === 0)
}

export function isObject(value) {
  if (value === null) { return false }
  return ((typeof value === 'function') || (typeof value === 'object'))
}

export function get(object = {}, path = "", defaultValue) {
  if (!isObject(object) || typeof path !== 'string') {
    return defaultValue
  }
  const properties = path.split(".")
  let head = object
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i]
    if (i === properties.length - 1 &&
      isObject(head)) {
      if (isNil(head[property])) { return defaultValue }
      return head[property]
    } else if (!isObject(head)) {
      return defaultValue
    } else {
      head = head[property]
    }
  }
}

export function nullOr(value) {
  if (value === undefined) { return null }
  return value
}

export function nullString(str = "") {
  if (typeof str !== 'string') {
    return null
  }
  return str === null
    ? null
    : str.trim() === "" ? null
    : str
}

export function debounce(func, delay) {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function groupBy(array = [], field = "") {
  return array.reduce(
    (r, v, i, a, k = get(v, field, "")) => {
      (r[k] || (r[k] = [])).push(v)
      return r
    },
    {},
  )
}

export function groupInOrderByFunc(array = [], f = () => false) {
  const groups = []
  for (let i = 0; i < array.length; i++) {
    if (f(array[i])) {
      const group = []
      do {
        group.push(array[i])
        i++
      } while (i < array.length && f(array[i]))
      groups.push(group)
    } else {
      const group = []
      while (i < array.length && !f(array[i])) {
        group.push(array[i])
        i++
      }
      groups.push(group)
    }
    i--
  }
  return groups
}

export function recursiveReactChildrenMap(children, f) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveReactChildrenMap(child.props.children, f)
      })
    }

    return f(child)
  })
}

export function makeCancelable (promise) {
  let hasCanceled_ = false

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    )
  })

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true
    },
  }
}

export function moveListItem(list, startIndex, endIndex) {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function log(e) {
  console.log(e)
}

export function monitorEvents(element) {
  const events = []

  for (let i in element) {
    if (i.startsWith("on")) events.push(i.substr(2))
  }
  events.forEach(function(eventName) {
    element.addEventListener(eventName, log)
  })
}

export function unmonitorEvents(element) {
  const events = []

  for (let i in element) {
    if (i.startsWith("on")) events.push(i.substr(2))
  }
  events.forEach(function(eventName) {
    element.removeEventListener(eventName, log)
  })
}

export function onElementHeightChange(elm, callback) {
  let lastHeight = elm.clientHeight, newHeight;

  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight !== newHeight) {
      callback();
    }
    lastHeight = newHeight;

    if(elm.onElementHeightChangeTimer) {
      clearTimeout(elm.onElementHeightChangeTimer);
    }

    elm.onElementHeightChangeTimer = setTimeout(run, 200);
  })();
}

export function getHandleClickLink(to) {
  return (e) => {
    getHistory().push(to)
  }
}

export function filterDefinedReactChildren(children) {
  return React.Children.map(children, c => c).filter(isDefined)
}

export function capitalize(s) {
  if (typeof s !== "string") return ""
  return s.charAt(0).toUpperCase() + s.slice(1)
}
