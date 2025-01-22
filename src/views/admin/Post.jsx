import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { Plus, Trash2, SquarePen } from 'lucide-react'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { collection, deleteDoc, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import AddDashboardImages from '../../components/modal/AddDashboardImages'
import PostUpdate from '../../components/modal/PostUpdate'
import Toast from '../../components/Toast'

export default function Post() {

    const { isOpen: isOpenPostUpdate, onOpen: onOpenPostUpdate, onClose: onClosePostUpdate } = Chakra.useDisclosure()
    const { isOpen: isOpenAddDashboardImages, onOpen: onOpenAddDashboardImages, onClose: onCloseAddDashboardImages } = Chakra.useDisclosure()
    const [isPostImageOpen, setIsPostImageOpen] = React.useState(false)
    const [existingImages, setExistingImages] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [postDeleteLoading, setPostDeleteLoading] = React.useState(false)
    const [loadingImageId, setLoadingImageId] = React.useState(null)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')
    const [updates, setUpdates] = React.useState([])
    const [selectedPostImage, setSelectedPostImage] = React.useState(null)
    const showToast = Toast()

    const fetchExistingImages = () => {
        try {
            setLoading(true)
            const imagesCollection = collection(firestoreDB, 'dashboard_images')
            const unsubscribe = onSnapshot(imagesCollection, (querySnapshot) => {
                const images = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                setExistingImages(images)
            })

            return unsubscribe
        } catch (error) {
            setErrorMessage(`Error fetching existing images: ${error}`)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (imageId, imageUrl) => {
        try {
            setLoadingImageId(imageId)
            const imageDocRef = doc(firestoreDB, 'dashboard_images', imageId)
            await deleteDoc(imageDocRef)

            const storageRef = ref(storage, imageUrl)
            await deleteObject(storageRef)
            fetchExistingImages()

        } catch (error) {
            alert(`Error deleting image: ${error}`)
        } finally {
            setLoadingImageId(null)
        }
    }

    React.useEffect(() => {
        const unsubscribe = fetchExistingImages()
        return () => unsubscribe()
    }, [])

    React.useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestoreDB, 'updates'), (snapshot) => {
            const updatesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate(),
            }))
            setUpdates(updatesList)
        })

        return () => unsubscribe()
    }, [])

    const handleDeletePost = async (id) => {
        if (window.confirm("Are you sure you want to delete this update?")) {
            try {
                setPostDeleteLoading(true)
                const docRef = doc(firestoreDB, 'updates', id)
                const docSnapshot = await getDoc(docRef)

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    if (data.images && data.images.length > 0) {
                        const deletePromises = data.images.map((imagePath) => {
                            const imageRef = ref(storage, imagePath)
                            return deleteObject(imageRef)
                        })

                        await Promise.all(deletePromises)
                    }
                }

                await deleteDoc(docRef)
            } catch (error) {
                setPostDeleteLoading(false)
                showToast({ title: 'Error:', description: `Failed to delete post: ${error.message}`, status: 'error', variant: 'solid', position: 'top' })
            } finally {
                showToast({ title: 'Success:', description: 'Post deleted successfully.', status: 'success', variant: 'solid', position: 'top' })
                setPostDeleteLoading(false)
            }
        }
    }

    const viewImage = (imageUrl) => {
        setSelectedPostImage(imageUrl)
        setIsPostImageOpen(true)
    }

    const closeImage = () => {
        setSelectedPostImage(null)
        setIsPostImageOpen(false)
    }

    return (
        <Chakra.Box w='100%' h='100%' p='1.5%' overflow='auto' userSelect='none'>
            <Helmet>
                <title>Post - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="Welcome to the Post page of the Tagongon Elementary School Profiling System." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            <Chakra.Box w='100%' p='1vw' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)' border='.1vw solid rgba(0, 0, 0, 0.05)'>
                <Chakra.Text as='h1' fontSize='.9vw' fontWeight='500'>Dashboard Images</Chakra.Text>
                <hr />
                {
                    !loading ? (
                        <Chakra.Box w='100%' mt='.1vw' mb='1vw' display='flex' alignItems='flex-start' justifyContent='flex-start' flexWrap='wrap'>
                            {
                                error ? (
                                    <Chakra.Box w='100%' mt='.1vw' mb='1vw' pt='1vw' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                        <Chakra.Text fontSize='.9vw'>{errorMessage}</Chakra.Text>
                                        <Chakra.Text fontSize='.9vw' fontWeight='500'>Reload the page.</Chakra.Text>
                                    </Chakra.Box>
                                ) : (
                                    <>
                                        {
                                            existingImages.length === 0 ? (
                                                <Chakra.Box w='100%' mt='.1vw' mb='1vw' pt='1vw' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                                    <Chakra.Text fontSize='.9vw' fontStyle='italic'>No images found.</Chakra.Text>
                                                </Chakra.Box>
                                            ) : (
                                                <>
                                                    {existingImages.map((image) => (
                                                        <Chakra.Card key={image.id} w='18.5%' m='1.9% .5% .5% .5%' borderRadius='0' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)'>
                                                            <Chakra.Image w='100%' h='8vw' objectFit='cover' src={image.url} alt='dashboard image' />
                                                            <Chakra.Button onClick={() => handleDelete(image.id, image.url)} isLoading={loadingImageId === image.id} h='1.8vw' mt='.7vw' colorScheme='red' fontSize='.7vw' borderRadius='0' leftIcon={<Trash2 size='.7vw' strokeWidth='.2vw' />}>Delete</Chakra.Button>
                                                        </Chakra.Card>
                                                    ))}
                                                </>
                                            )
                                        }

                                    </>
                                )
                            }
                        </Chakra.Box>
                    ) : (
                        <Chakra.Box w='100%' mt='.1vw' mb='1vw' pt='1vw' display='flex' alignItems='center' justifyContent='center'>
                            <Chakra.Spinner w='1vw' h='1vw' thickness='.1vw' mr='.5vw' />
                            <Chakra.Text fontSize='.9vw' fontStyle='italic'>Loading...</Chakra.Text>
                        </Chakra.Box>
                    )
                }
                <hr />
                <Chakra.Text fontSize='.9vw' mt='.5vw' mb='.5vw'><i><b>Note:</b></i> <i>You can upload a maximum of 10 images only. Please delete existing images if you wish to add more.</i></Chakra.Text>
                <Chakra.Box w='100%' mt='1vw' display='flex' justifyContent='right'>
                    <Chakra.Button onClick={onOpenAddDashboardImages} isDisabled={existingImages.length === 10} h='1.6vw' colorScheme='blue' fontSize='.7vw' borderRadius='0' rightIcon={<Plus size='.7vw' strokeWidth='.3vw' />}>Add</Chakra.Button>
                </Chakra.Box>
            </Chakra.Box>
            <Chakra.Box w='100%' mt='1.5%' mb='5%' p='1vw' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .3)' border='.1vw solid rgba(0, 0, 0, 0.05)'>
                <Chakra.Text as='h1' fontSize='.9vw' fontWeight='500'>Post Updates</Chakra.Text>
                <hr />
                <Chakra.Box w='100%' display='flex' flexWrap="wrap" justifyContent='space-between'>
                    {updates.length === 0 ? (
                        <Chakra.Text>No updates available</Chakra.Text>
                    ) : (
                        updates.map((update, index) => (
                            <Chakra.Card key={index} w='49.3%' mt='1vw' p='1.5vw' borderRadius='0' boxShadow='none' border='.1vw solid rgba(0, 0, 0, 0.12)'>
                                <Chakra.Heading fontSize='1vw' textTransform='capitalize'>{update.header}</Chakra.Heading>
                                <Chakra.Box w='100%' mt='1%'>
                                    <Chakra.Box w='100%' fontSize='.9vw'>
                                        <Chakra.Text fontSize='.9vw' mt='.5vw' fontStyle='italic'>Content:</Chakra.Text>
                                        <Chakra.Text fontSize='.9vw' mt='.3vw' pl='1vw' pr='1vw' textAlign='justify'>{update.content}</Chakra.Text>
                                    </Chakra.Box>
                                    <Chakra.Box w='100%' p='0 1vw 0 1vw' mt='1.5vw' display='flex' flexWrap="wrap" alignItems='center'>
                                        {update.images && update.images.length > 0 ? (
                                            update.images.map((imageUrl, imgIndex) => (
                                                <Chakra.Image key={imgIndex} onClick={() => viewImage(imageUrl)} cursor='pointer' h='10vw' m='.1vw' objectFit='cover' src={imageUrl} alt={`Update Image ${imgIndex + 1}`} border='.1vw solid rgba(0, 0, 0, 0.43)' _hover={{ boxShadow: '.3vw .3vw .3vw rgb(105, 126, 116, .3)', transition: '.3s' }} transition='.3s' />
                                            ))
                                        ) : (
                                            <Chakra.Text>No Images</Chakra.Text>
                                        )}
                                    </Chakra.Box>
                                </Chakra.Box>
                                <Chakra.Text mt='1.5vw' pl='1vw' pr='1vw' fontSize='.7vw' fontStyle='italic'><b>Date Posted:</b> {update.timestamp ? new Date(update.timestamp).toLocaleDateString() : 'Unknown'}</Chakra.Text>
                                <hr />
                                <Chakra.Box w='100%' display='flex' alignItems='center' justifyContent='right'>
                                    <Chakra.Button onClick={() => handleDeletePost(update.id)} isDisabled={postDeleteLoading} h='1.6vw' mt='.7vw' colorScheme='red' fontSize='.7vw' borderRadius='0' leftIcon={<Trash2 size='.7vw' strokeWidth='.2vw' />}>Delete</Chakra.Button>
                                </Chakra.Box>
                            </Chakra.Card>
                        ))
                    )}
                </Chakra.Box>
                <Chakra.Box w='100%' mt='2%' display='flex' justifyContent='right'>
                    <Chakra.Button onClick={onOpenPostUpdate} h='1.6vw' colorScheme='blue' fontSize='.7vw' borderRadius='0' rightIcon={<SquarePen size='.7vw' strokeWidth='.2vw' />}>Post Update</Chakra.Button>
                </Chakra.Box>
            </Chakra.Box>

            <AddDashboardImages isOpen={isOpenAddDashboardImages} onClose={onCloseAddDashboardImages} />
            <PostUpdate isOpen={isOpenPostUpdate} onClose={onClosePostUpdate} />

            <Chakra.Modal isOpen={isPostImageOpen} onClose={closeImage} size="xl">
                <Chakra.ModalOverlay />
                <Chakra.ModalContent borderRadius='0'>
                    <Chakra.ModalCloseButton />
                    <Chakra.ModalHeader>
                        <Chakra.Heading fontSize='.9vw'>Post Image</Chakra.Heading>
                    </Chakra.ModalHeader>
                    <hr />
                    <Chakra.ModalBody>
                        {selectedPostImage && (
                            <Chakra.Image src={selectedPostImage} alt="Selected Image" objectFit="contain" w="100%" />
                        )}
                    </Chakra.ModalBody>
                    <hr />
                    <Chakra.ModalFooter>
                        <Chakra.Button onClick={() => closeImage()} h='1.8vw' fontSize='.8vw' fontWeight='400' colorScheme='blue' borderRadius='0'>Okay</Chakra.Button>
                    </Chakra.ModalFooter>
                </Chakra.ModalContent>
            </Chakra.Modal>

        </Chakra.Box>
    )
}
