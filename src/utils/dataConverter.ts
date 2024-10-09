
export const convertBidMethodToReadable = (method: string) => {
  //convert from FIXED_PRICE to Fixed Price, all caps to first letter caps, and remove the underscore
  return method.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}