import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Alert, Button, Toast as DaisyToast } from 'react-daisyui'

export type ToastStatus = 'info' | 'success' | 'error' | 'warning'

export type ToastConfig = {
  status: ToastStatus
  title: ReactNode
  message?: ReactNode
  timeout?: number | 'permanent'
}
type ToastContext = {
  showToast: (config: ToastConfig) => void
}

type ToastProps = {
  config: ToastConfig
  onClose: () => void
}
const Toast: FC<ToastProps> = ({ config, onClose }) => {
  useEffect(() => {
    if (config.timeout !== 'permanent') {
      const timeout = config.timeout ?? 5000
      setInterval(onClose, timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Alert status={config.status}>
      <div className='flex flex-col'>
        <div className='flex flex-row items-center justify-between gap-x-5'>
          <div className='text-lg font-bold' style={{ whiteSpace: 'nowrap' }}>
            {config.title}
          </div>
          <Button onClick={onClose} color='ghost'>
            <FontAwesomeIcon className='text-2xl' icon={faClose} />
          </Button>
        </div>
        {config.message}
      </div>
    </Alert>
  )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Context = createContext<ToastContext>({ showToast: () => {} })

export const useToast = () => useContext(Context)

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Record<string, ToastConfig>>({})
  const showToast = (config: ToastConfig) =>
    setToasts((t) => ({
      [crypto.randomUUID()]: config,
      ...t,
    }))

  const removeToast = (toastId: string) =>
    setToasts((t) =>
      Object.fromEntries(Object.entries(t).filter(([id]) => id !== toastId))
    )

  return (
    <div className='w-full'>
      <Context.Provider value={{ showToast }}>{children}</Context.Provider>
      <DaisyToast
        // className='w-full xs:w-20 sm:w-3/4 md:w-1/2 lg:w-1/3 max-w-xs'
        className='!right-0 !left-0 !w-96'
        vertical='top'
        horizontal='center'
      >
        {Object.entries(toasts).map(([id, config]) => (
          <Toast
            key={id}
            config={config}
            onClose={() => removeToast(id)}
          ></Toast>
        ))}
      </DaisyToast>
    </div>
  )
}

export const mutationToToastStatus = (
  status: 'success' | 'error' | 'idle' | 'loading'
): ToastStatus | undefined => {
  if (status === 'success' || status === 'error') {
    return status
  }
  return undefined
}

export const useStatusToast = (
  status: ToastStatus | undefined,
  config: Partial<Record<ToastStatus, Partial<ToastConfig>>>
) => {
  const { showToast } = useToast()
  useEffect(() => {
    if (!status) {
      return
    }
    if (status === 'success' && config['success']) {
      showToast({
        title: 'Success!',
        status,
        ...config['success'],
      })
    } else if (status === 'error' && config['error']) {
      showToast({
        title: 'Error!',
        message: 'Please try again or contact us if the problem persists.',
        status,
        timeout: 'permanent',
        ...config['error'],
      })
    } else if (status === 'info' && config['info']) {
      showToast({
        title: 'Info',
        status,
        ...config['info'],
      })
    } else if (status === 'warning' && config['warning']) {
      showToast({
        title: 'Warning!',
        status,
        ...config['warning'],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])
}
