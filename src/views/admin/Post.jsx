import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { Plus, Trash2 } from 'lucide-react'
import { firestoreDB, storage } from '../../config/FirebaseConfig'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import AddDashboardImages from '../../components/modal/AddDashboardImages'

export default function Post() {

    const { isOpen: isOpenAddDashboardImages, onOpen: onOpenAddDashboardImages, onClose: onCloseAddDashboardImages } = Chakra.useDisclosure()
    const [existingImages, setExistingImages] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [loadingImageId, setLoadingImageId] = React.useState(null)
    const [error, setError] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState('')

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
                                                            <Chakra.Image w='100%' h='8vw' objectFit='contain' src={image.url} alt='dashboard image' />
                                                            <Chakra.Button onClick={() => handleDelete(image.id, image.url)} isLoading={loadingImageId === image.id} h='1.8vw' mt='.7vw' colorScheme='red' fontSize='.8vw' borderRadius='0' leftIcon={<Trash2 size='.8vw' strokeWidth='.2vw' />}>Delete</Chakra.Button>
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

            <AddDashboardImages isOpen={isOpenAddDashboardImages} onClose={onCloseAddDashboardImages} />
        </Chakra.Box>
    )
}
