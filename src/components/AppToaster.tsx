import {
  HStack,
  Toaster,
  ToastCloseTrigger,
  ToastDescription,
  ToastIndicator,
  ToastRoot,
  ToastTitle,
  VStack,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
  max: 3,
})

export default function AppToaster() {
  return (
    <Toaster toaster={toaster} insetInline={{ base: '4', md: 'unset' }}>
      {(toast) => (
        <ToastRoot>
          <HStack gap={3} align="flex-start">
            <ToastIndicator mt={0.5} />
            <VStack gap={0.5} align="flex-start" flex={1}>
              {toast.title ? <ToastTitle>{toast.title}</ToastTitle> : null}
              {toast.description ? <ToastDescription>{toast.description}</ToastDescription> : null}
            </VStack>
            <ToastCloseTrigger />
          </HStack>
        </ToastRoot>
      )}
    </Toaster>
  )
}