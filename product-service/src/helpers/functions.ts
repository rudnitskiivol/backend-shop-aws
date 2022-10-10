export const isNotEmptyObject = (obj: Record<string, any> | null): boolean => {
  return obj != null && Object.keys(obj).length !== 0 && obj.constructor === Object
}

export const isEmptyObject = (obj: Record<string, any> | null): boolean => {
  return !isNotEmptyObject(obj)
}
