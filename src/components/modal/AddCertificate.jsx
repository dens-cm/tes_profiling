/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import { TiPlus, TiUpload } from "react-icons/ti"
import { doc, setDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { useAuth } from '../../config/Authentication'
import placeholder from '../../assets/placeholder.png'
import Toast from '../Toast'

export default function AddCertificate({ isOpen, onClose }) {

    const { currentUser } = useAuth()
    const [imageFile, setImageFile] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const showToast = Toast()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setImageFile(file)
    }

    const [formData, setFormData] = React.useState({
        title: '',
        venue: '',
        date: '',
        sponsoringAgency: '',
        imageUrl: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let imageUrl = formData.imageUrl

            const collectionRef = collection(firestoreDB, `users/${currentUser.uid}/certificates`)
            const docRef = doc(collectionRef)
            const autoId = docRef.id

            const storagePath = `users/${currentUser.uid}/certificates/${autoId}/image.jpg`
            const imageRef = ref(storage, storagePath);

            if (imageFile) {
                await uploadBytes(imageRef, imageFile)
            }

            else {
                const response = await fetch(placeholder)
                const placeholderBlob = await response.blob()
                await uploadBytes(imageRef, placeholderBlob)
            }

            imageUrl = await getDownloadURL(imageRef)
            await setDoc(docRef, { ...formData, imageUrl }, { merge: true })
            showToast({ description: 'Your certificate has been saved!', status: 'success', variant: 'solid', position: 'top', })
            setFormData({
                title: '',
                venue: '',
                date: '',
                sponsoringAgency: '',
                imageUrl: ''
            })
            setImageFile(null)
            onClose()
        }

        catch (error) {
            showToast({ title: 'There was an issue saving your certificate.', description: error.message, status: 'error', variant: 'solid', position: 'top' })
        }

        finally {
            setIsLoading(false)
        }
    }


    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} scrollBehavior='outside' size='lg'>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <Chakra.ModalHeader display='flex' alignItems='center' justifyContent='space-between'>
                    <Chakra.Text fontSize='1vw' fontWeight='bold' color='gray.600'>Add Certificate</Chakra.Text>
                    <Chakra.IconButton onClick={onClose} w='1vw' h='2vw' fontSize='1vw' bg='#0000' icon={<SmallCloseIcon />}  borderRadius='0'/>
                </Chakra.ModalHeader>
                <Chakra.ModalBody p='0 5% 5% 5%'>
                    <hr />
                    <form onSubmit={handleSubmit} style={{ width: '100%', padding: '4% 0 0 0', display: 'flex', flexDirection: 'column' }}>
                        <Chakra.Text fontSize='.9vw' fontWeight='600' color='gray.700'>Title:</Chakra.Text>
                        <Chakra.Input required name='title' value={formData.title} onChange={handleChange} h='2.1vw' fontSize='.9vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                        <Chakra.Text mt='3%' fontSize='.9vw' fontWeight='600' color='gray.700'>Venue:</Chakra.Text>
                        <Chakra.Input required name='venue' value={formData.venue} onChange={handleChange} h='2.1vw' fontSize='.9vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                        <Chakra.Text mt='3%' fontSize='.9vw' fontWeight='600' color='gray.700'>Date:</Chakra.Text>
                        <Chakra.Input required name='date' value={formData.date} onChange={handleChange} type='date' h='2.1vw' fontSize='.9vw' variant='filled' borderRadius='0' />
                        <Chakra.Text mt='3%' fontSize='.9vw' fontWeight='600' color='gray.700'>Sponsoring Agency:</Chakra.Text>
                        <Chakra.Input required name='sponsoringAgency' value={formData.sponsoringAgency} onChange={handleChange} h='2.1vw' fontSize='.9vw' textTransform='capitalize' variant='filled' borderRadius='0' placeholder='...' />
                        <Chakra.Input type="file" accept="image/*" onChange={handleImageChange} id="file-input" hidden />
                        <Chakra.Text mt='4%' fontSize='.8vw' fontStyle='italic' color='gray.500'>* Upload photo</Chakra.Text>
                        <Chakra.Image w='100%' h='10vw' mt='1%' bg='gray.100' objectFit='contain' src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl || placeholder} />
                        <Chakra.Box w='100%' mb='4%' display='flex' justifyContent='right'>
                            <Chakra.Button onClick={() => document.getElementById('file-input').click()} h='1.7vw' mt='2.5%' fontSize='.8vw' fontWeight='500' colorScheme='blue' leftIcon={<TiPlus />} borderRadius='0'>Select image</Chakra.Button>
                        </Chakra.Box>
                        <hr />
                        <Chakra.Button type='submit' h='2.1vw' mt='4%' fontSize='.8vw' colorScheme='teal' isLoading={isLoading} isDisabled={!imageFile} leftIcon={<TiUpload />} borderRadius='0'>Save</Chakra.Button>
                    </form>
                </Chakra.ModalBody>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
