/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { useAuth } from '../../config/Authentication'
import Toast from '../Toast'

export default function Logout({ isOpen, onClose }) {

    const { logout } = useAuth()
    const [isLoading, setIsLoading] = React.useState(false)
    const showToast = Toast()

    const handleLogout = () => {
        setIsLoading(true)

        try {
            showToast({ description: `Logout successfully`, status: 'success', variant: 'solid', position: 'top', })
            logout()
        }

        catch (error) {
            showToast({ description: `Error: ${error}`, status: 'error', variant: 'solid', position: 'top', })
        }

        finally {
            onClose()
            setIsLoading(false)
        }
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} size='lg'>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <Chakra.ModalHeader display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.600'>Confirm logout</Chakra.Text>
                    <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />} borderRadius='0' />
                </Chakra.ModalHeader>
                <Chakra.ModalBody>
                    <hr />
                    <Chakra.Text mt='5%' mb='5%' fontSize='1vw' fontWeight='400'>Are you sure you want to logout?</Chakra.Text>
                    <hr />
                    <Chakra.Box w='100%' mt='5%' mb='3%' display='flex' justifyContent='right'>
                        <Chakra.Button onClick={handleLogout} isLoading={isLoading} h='1.7vw' fontSize='.8vw' colorScheme='red' borderRadius='0'>Logout</Chakra.Button>
                        <Chakra.Button onClick={onClose} h='1.7vw' ml='1%' fontSize='.8vw' colorScheme='teal' borderRadius='0'>Cancel</Chakra.Button>
                    </Chakra.Box>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
