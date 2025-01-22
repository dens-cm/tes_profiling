/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { X, SquarePen, FileCheck2, CloudUpload, LayoutDashboard } from 'lucide-react'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { collection, addDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import Toast from '../../components/Toast'

export default function PostUpdate({ isOpen, onClose }) {

    const [header, setHeader] = React.useState('')
    const [content, setContent] = React.useState('')
    const [images, setImages] = React.useState([])
    const [imagePreview, setImagePreview] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const showToast = Toast()

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 3) {
            alert('You can only select up to 3 images.')
            return
        }

        const imageUrls = files.map((file) => URL.createObjectURL(file))
        setImages(files)
        setImagePreview(imageUrls)
    }

    const uploadImages = async (autoId) => {
        const uploadPromises = images.map((file, index) => {
            const storageRef = ref(storage, `updates/${autoId}/image${index + 1}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            return new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    null,  
                    (error) => reject(error),
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        resolve(downloadURL)
                    }
                )
            })
        })

        return Promise.all(uploadPromises)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (header && content) {
            setLoading(true);
            try {
                const docRef = await addDoc(collection(firestoreDB, 'updates'), {
                    header,
                    content,
                    timestamp: new Date(),
                })

                const docId = docRef.id
                const imageUrls = await uploadImages(docId)

                await updateDoc(docRef, {
                    images: imageUrls,  
                })

                setHeader('')
                setContent('')
                setImages([])
                setImagePreview([])
                onClose()
            } catch (error) {
                showToast({ title: 'Error posting update:', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
            } finally {
                showToast({ title: 'Success:', description: `Update posted`, status: 'success', variant: 'solid', position: 'top' })
                setLoading(false)
            }
        } else {
            showToast({ title: 'Info:', description: `Please fill in the header, content, and select images.`, status: 'info', variant: 'solid', position: 'top' })
        }
    }

    const handleClose = () => {
        setHeader('')
        setContent('')
        setImages([])
        setImagePreview([])
        onClose()
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} isCentered size='md' closeOnOverlayClick={false}>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent borderRadius='0'>
                <form onSubmit={handleSubmit}>
                    <Chakra.ModalHeader display='flex' alignItems='center'>
                        <Chakra.Icon mr='.3vw' as={SquarePen} fontSize='.9vw' />
                        <Chakra.Heading fontSize='.8vw' textTransform='uppercase'>Post an update</Chakra.Heading>
                    </Chakra.ModalHeader>
                    <hr />
                    <Chakra.ModalBody>
                        <Chakra.Text mb='.5vw' fontSize='.8vw' fontWeight='bold'>HEADER:</Chakra.Text>
                        <Chakra.Input required value={header} onChange={(e) => setHeader(e.target.value)} h='2vw' p='0 .5vw 0 .5vw' fontSize='.9vw' fontWeight='500' textTransform='capitalize' variant='flushed' placeholder='type a header...' />
                        <Chakra.Text mt='1.8vw' mb='.5vw' fontSize='.8vw' fontWeight='bold'>CONTENT:</Chakra.Text>
                        <Chakra.Textarea value={content} onChange={(e) => setContent(e.target.value)} required h='2vw' p='0 .5vw 0 .5vw' fontSize='.9vw' fontWeight='400' textTransform='capitalize' variant='flushed' placeholder='type a header...' />
                        <Chakra.Text mt='1.8vw' mb='.5vw' fontSize='.8vw' fontWeight='bold'>PHOTOS:</Chakra.Text>
                        <Chakra.Box w='100%' mb='.5vw' p='0 2vw 0 2vw'>
                            {imagePreview.length > 0 ? (
                                imagePreview.map((url, index) => (
                                    <Chakra.Image key={index} w="100%" h="7vw" m='3% 0 3% 0' objectFit='contain' src={url} />
                                ))
                            ) : (
                                <Chakra.Text w='100%' textAlign='center' fontSize='.8vw'>No images selected.</Chakra.Text>
                            )}
                        </Chakra.Box>
                        <Chakra.Box mt='4%' mb='3%' display='flex' justifyContent='center'>
                            <Chakra.Input hidden type="file" accept=".jpg, .jpeg, .png" multiple onChange={handleFileChange} id="file-input" />
                            <Chakra.Button onClick={() => document.getElementById('file-input').click()} ml='.4vw' h='1.7vw' fontSize='.8vw' fontWeight='400' colorScheme='teal' borderRadius='0' leftIcon={<CloudUpload size='.8vw' />}>CHOOSE FILES</Chakra.Button>
                        </Chakra.Box>
                    </Chakra.ModalBody>
                    <hr />
                    <Chakra.ModalFooter display='flex' justifyContent='right'>
                        <Chakra.Button onClick={() => handleClose()} isDisabled={loading} h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='red' borderRadius='0' rightIcon={<X size='.7vw' strokeWidth='.3vw' />}>Cancel</Chakra.Button>
                        <Chakra.Button type='submit' isLoading={loading} ml='.4vw' h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='blue' borderRadius='0' rightIcon={<FileCheck2 size='.7vw' strokeWidth='.2vw' />}>Post</Chakra.Button>
                    </Chakra.ModalFooter>
                </form>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
