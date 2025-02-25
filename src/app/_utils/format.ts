export const formatPrice = (price: number): string => {
  const billion = Math.floor(price / 100000000);
  const million = Math.floor((price % 100000000) / 10000);
  
  if (billion > 0) {
    return `${billion}억 ${million > 0 ? `${million}만` : ''}`;
  }
  return `${million}만`;
}; 