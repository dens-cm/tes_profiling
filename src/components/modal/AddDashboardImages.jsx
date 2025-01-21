/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { ImagePlus, X, Save, CloudUpload } from 'lucide-react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import Toast from '../../components/Toast'

export default function AddDashboardImages({ isOpen, onClose }) {

    const [loading, setLoading] = React.useState(false)
    const [selectedImages, setSelectedImages] = React.useState([])
    const [existingImages, setExistingImages] = React.useState([])
    const showToast = Toast()

    // Fetch existing images from Firestore
    const fetchExistingImages = async () => {
        try {
            setLoading(true)
            const imagesCollection = collection(firestoreDB, 'dashboard_images')
            const querySnapshot = await getDocs(imagesCollection)
            const images = querySnapshot.docs.map((doc) => doc.data())
            setExistingImages(images)
        } catch (error) {
            showToast({ title: 'Error', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
        } finally {
            setLoading(false)
        }
    }

    // Check how many more images can be uploaded
    const getRemainingSlots = () => {
        return 10 - existingImages.length
    }

    React.useEffect(() => {
        if (isOpen) {
            fetchExistingImages()
        }
    }, [isOpen])

    // Handle file selection
    const handleFileChange = (e) => {
        const files = e.target.files
        const remainingSlots = getRemainingSlots()

        if (files.length > remainingSlots) {
            alert(`You already have ${existingImages.length} images. You can only add ${remainingSlots} more. Delete some images to upload more.`)
            return setSelectedImages([])
        }

        setSelectedImages([...selectedImages, ...files])
    }

    // Upload image to Firebase Storage and Firestore
    const handleUpload = async () => {
        setLoading(true)

        for (let i = 0; i < selectedImages.length; i++) {
            const file = selectedImages[i]
            const fileName = `image ${existingImages.length + i + 1}`
            const storageRef = ref(storage, `dashboard_images/${fileName}`)

            try {
                setLoading(true)
                const uploadTask = uploadBytesResumable(storageRef, file)
                await uploadTask
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

                // Save the image info to Firestore
                await addDoc(collection(firestoreDB, 'dashboard_images'), {
                    url: downloadURL,
                    name: fileName,
                })
            } catch (error) {
                showToast({ title: 'Error uploading image:', description: `${error}`, status: 'error', variant: 'solid', position: 'top' })
            } finally {
                showToast({ description: `${fileName} Saved successfully`, status: 'success', variant: 'solid', position: 'top' })
                setLoading(false)
            }
        }

        fetchExistingImages()
        setLoading(false)
        onClose()
    }

    const closeModal = () => {
        setSelectedImages([])
        onClose()
    }

    return (
        <Chakra.Modal isOpen={isOpen} onClose={onClose} isCentered size='md' closeOnOverlayClick={false}>
            <Chakra.ModalOverlay />
            <Chakra.ModalContent>
                <Chakra.ModalHeader display='flex' alignItems='center'>
                    <Chakra.Icon mr='.3vw' as={ImagePlus} fontSize='.8vw' />
                    <Chakra.Heading fontSize='.8vw' textTransform='uppercase'>Add Dashboard Images</Chakra.Heading>
                </Chakra.ModalHeader>
                <hr />
                <Chakra.ModalBody>
                    <Chakra.Input type='file' hidden multiple accept=".jpg, .jpeg, .png" onChange={handleFileChange} id='file-input' />
                    <Chakra.Button onClick={() => document.getElementById('file-input').click()} rightIcon={<CloudUpload size='.9vw' strokeWidth='.2vw'/>} w='100%' h='1.8vw' m='5% 0 5% 0' fontSize='.8vw' colorScheme='teal' borderRadius='0'>Choose Files</Chakra.Button>
                    <Chakra.Box mt='.2vw' mb='1vw'>
                        <Chakra.Text mb='.2vw' fontSize='.9vw' fontWeight='bold'>Selected Images</Chakra.Text>
                        {selectedImages.length === 0 ? (
                            <Chakra.Text fontSize='.9vw' pl='1vw' isTruncated>No file selected.</Chakra.Text>
                        ) : (
                            selectedImages.map((file, index) => (
                                <Chakra.Text key={index} fontSize='.9vw' pl='1vw' isTruncated>- {file.name}</Chakra.Text>
                            ))
                        )}
                    </Chakra.Box>
                </Chakra.ModalBody>
                <hr />
                <Chakra.ModalFooter display='flex' justifyContent='right'>
                    <Chakra.Button onClick={() => closeModal()} isDisabled={loading} h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='red' borderRadius='0' rightIcon={<X size='.7vw' strokeWidth='.3vw' />}>Cancel</Chakra.Button>
                    <Chakra.Button onClick={handleUpload} isLoading={loading} isDisabled={selectedImages.length === 0} ml='.4vw' h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='blue' borderRadius='0' rightIcon={<Save size='.7vw' strokeWidth='.2vw' />}>Save</Chakra.Button>
                </Chakra.ModalFooter>
            </Chakra.ModalContent>
        </Chakra.Modal>
    )
}
