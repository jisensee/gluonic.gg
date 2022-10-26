export const shortenAddress = (address: string) =>
  address.slice(0, 6) +
  '...' +
  address.slice(address.length - 4, address.length)

export const Format = {
  username: (name: string | null) =>
    name && name.length > 0 ? name : 'Anonymous',
}
