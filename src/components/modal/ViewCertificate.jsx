/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { BiSolidFolder } from "react-icons/bi"
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { doc, deleteDoc } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { useAuth } from '../../config/Authentication'
import Toast from '../Toast'

export default function ViewCertificate({ isOpen, onClose, certificate, userType }) {

    const { currentUser } = useAuth()
    const [loading, setLoading] = React.useState(false)
    const showToast = Toast()

    const handleDelete = async () => {
        setLoading(true)
        
        try {
            await deleteDoc(doc(firestoreDB, 'users', currentUser.uid, 'certificates', certificate.id))
            
            if (certificate.imageUrl) {
                const imageRef = ref(storage, certificate.imageUrl) 
                await deleteObject(imageRef)
            }
            
            showToast({ description: 'Certificate deleted successfully', status: 'success', variant: 'solid', position: 'top' })
            onClose() 
        } 
        
        catch (error) {
            showToast({ description: `Error deleting certificate: ${error.message}`, status: 'error', variant: 'solid', position: 'top' })
        }

        finally {
            setLoading(false)
        }
    }

    const handleImageClick = () => {
        if (certificate && certificate.imageUrl) {
            window.open(certificate.imageUrl, '_blank')
        }

        else {
            console.error("No image URL available for display.")
        }
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} scrollBehavior='outside' size='lg'>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <Chakra.ModalHeader display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.600'>Certificate</Chakra.Text>
                    <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />} borderRadius='0'/>
                </Chakra.ModalHeader>
                <Chakra.ModalBody p='0 5% 5% 5%'>
                    <hr/>
                    <Chakra.Text mt='4%' mb='1%' fontSize='.7vw' fontWeight='500' fontStyle='italic' color='gray.500' display='flex'><Chakra.Text mr='1.5%' fontSize='.9vw'>{<BiSolidFolder/>}</Chakra.Text>{new Date(certificate?.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Chakra.Text>
                    <hr/>
                    <Chakra.Text mt='4%' fontSize='1.1vw' fontWeight='bold' color='gray.600' textTransform='capitalize'>{certificate?.title}</Chakra.Text>
                    <Chakra.Text fontSize='.9vw' fontWeight='400' color='gray.600' textTransform='capitalize'>venue: {certificate?.venue}</Chakra.Text>
                    <Chakra.Text mb='4%' fontSize='.9vw' fontWeight='400' color='gray.600' textTransform='capitalize'>sponsoring agency: {certificate?.sponsoringAgency}</Chakra.Text>
                    <Chakra.Image w='100%' h='15vw' mb='4%' objectFit='contain' bg='gray.100' src={`${certificate?.imageUrl}`} alt='certificate image'/>
                    <hr/>
                    <Chakra.Box w='100%' mt='4%' display='flex' justifyContent='right'>
                        <Chakra.Button onClick={handleDelete} isLoading={loading} disabled={userType?.userType !== 'user'} colorScheme='red' h='2vw' fontSize='.8vw' fontWeight='400' borderRadius='0'>Delete</Chakra.Button>
                        <Chakra.Button onClick={handleImageClick} colorScheme='teal' ml='1.5%' h='2vw' fontSize='.8vw' fontWeight='400' borderRadius='0'>View image</Chakra.Button>
                    </Chakra.Box>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
