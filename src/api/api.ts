import axios from 'axios'
import socketCluster, { SCClientSocket } from 'socketcluster-client'
import { isProduction } from '../helpers/env'

interface Chain {
  fcd: string
  socket: SCClientSocket.ClientOptions
}

const Chain = {
  SOJU: 'soju-0013',
  VODKA: 'vodka-0001'
  // COLUMBUS: "columbus-3",
  // FITZ: "fitz"
}

export const ChainList = [Chain.SOJU, Chain.VODKA]
// .concat
// !isProduction ? [Chain.FITZ] : []
// ();

const Chains: { [slug: string]: Chain } = {
  [Chain.SOJU]: {
    fcd: 'https://soju-fcd.terra.dev',
    socket: { hostname: 'soju-fcd.terra.dev', port: 443, secure: true }
  },
  [Chain.VODKA]: {
    fcd: 'https://vodka-fcd.terra.dev',
    socket: { hostname: 'vodka-fcd.terra.dev', port: 443, secure: true }
  }
  // [Chain.COLUMBUS]: {
  //   fcd: "https://fcd.terra.dev",
  //   socket: { hostname: "fcd.terra.dev", port: 443, secure: true }
  // },
  // [Chain.FITZ]: {
  //   fcd: "https://fitz.terra.money:5562",
  //   socket: { hostname: "fcd.terra.dev", port: 443, secure: true }
  // }
}

const instance = axios.create()

instance.interceptors.request.use(({ params, ...config }) => ({
  ...config,
  params: { ...params, _t: Date.now() }
}))

export const changeChain = (slug: string) => {
  const { fcd } = getChain(slug)
  instance.defaults.baseURL = fcd
}

export default instance

/* socket */
export const useSocket = (slug: string) => {
  const { socket: options } = getChain(slug)
  const socket = socketCluster.create(options)
  socket.on('error', /* ignore */ () => {})
  return socket
}

/* helper */
const getChain = (slug: string) => Chains[slug] ?? Chains[Chain.SOJU]
