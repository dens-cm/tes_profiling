import React from 'react'
import * as Chakra from '@chakra-ui/react'
import { Helmet } from 'react-helmet'
import { TiMail, TiLockClosedOutline, TiArrowRightThick } from "react-icons/ti"
import { UserRoundPlus, MapPin, Facebook, UserRound, Rocket, MessageCircleHeart, HeartHandshake, Mails } from 'lucide-react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../config/Authentication'
import { handleLogin } from '../../utils/authentication/handleLogin'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestoreDB } from '../../config/FirebaseConfig'
import Toast from '../../components/Toast'
import schoolLogo from '../../assets/tes_logo.png'
import TES_image from '../../assets/TES_image.jpg'

export default function Login() {

    const emailRef = React.useRef()
    const passwordRef = React.useRef()
    const [loading, setLoading] = React.useState(false)
    const { login } = useAuth()
    const [imageUrls, setImageUrls] = React.useState([])
    const [sliderLoading, setSliderLoading] = React.useState(true)
    const [updates, setUpdates] = React.useState([])
    const showToast = Toast()
    const navigate = useNavigate()

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false
    }

    React.useEffect(() => {
        const imagesCollection = collection(firestoreDB, 'dashboard_images')
        const unsubscribe = onSnapshot(imagesCollection, (querySnapshot) => {
            const images = querySnapshot.docs.map((doc) => doc.data().url)
            setImageUrls(images)
            setSliderLoading(false)
        })

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

    return (
        <Chakra.Box w='100%' h='100%' backgroundImage={TES_image} userSelect='none' overflow="auto" sx={{ '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none', }}>
            <Helmet>
                <title>Login - Tagongon Elementary School Profiling System</title>
                <meta name="description" content="Log in to the Tagongon Elementary School Profiling System to manage teacher and student data efficiently." />
                <link rel="icon" type="image/svg+xml" href="/tes_logo.png" />
            </Helmet>
            <Chakra.Box w='100%' bg='rgba(255, 255, 255, .9)' p='1%'>
                <Chakra.Box w='100%' p='.4% .4% .2% .4%' display='flex' alignItems='end'>
                    <Chakra.Box w='50%' display='flex' alignItems='center'>
                        <Chakra.Image h='1vw' mr='.4%' src={schoolLogo} />
                        <Chakra.Text fontSize='.7vw' fontWeight='700' textTransform='uppercase'>Tagongon Elementary School</Chakra.Text>
                    </Chakra.Box>
                    <Chakra.Box w='50%' display='flex' justifyContent='right'>
                        <Chakra.Button onClick={() => navigate('/register')} h='1.7vw' bg='#094333' color='white' fontSize='.7vw' fontWeight='500' leftIcon={<UserRoundPlus strokeWidth='.2vw' size='.8vw' />} borderRadius='0'>Create account</Chakra.Button>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' p='0 .4% 0 .4%' display='flex' alignItems='center'>
                    <Chakra.Box w='100%' h='.1px' bg='#094333'></Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' p='.4% .4% 0% .4%' display='flex' alignItems='center'>
                    <Chakra.Icon fontSize='.8vw' mr='.1%' as={MapPin} />
                    <Chakra.Text fontSize='.7vw' fontWeight='500' textTransform='uppercase'>Tagbina District I</Chakra.Text>
                </Chakra.Box>
                <Chakra.Box display='flex' alignItems='center'>
                    <Chakra.Icon fontSize='.7vw' ml='.4%' mr='.2%' as={Facebook} />
                    <Chakra.Text fontSize='.7vw' fontWeight='500'><Chakra.Link href='https://www.facebook.com/profile.php?id=61550210364893' isExternal>Facebook - Tagongon Elementary School</Chakra.Link></Chakra.Text>
                </Chakra.Box>
                <Chakra.Box w='100%' mt='1%' p='.4%'>
                    <Chakra.Box w='100%' p='.4% .4% .4% .6%' bg='#094333' display='flex' alignItems='center'>
                        <Chakra.Text color='white' mr='.3%'><UserRound strokeWidth='.2vw' size='.7vw' /></Chakra.Text>
                        <Chakra.Text fontSize='.7vw' fontWeight='700' color='white'>LOGIN</Chakra.Text>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' p='1.4% .8% .4% .8%' display='flex' justifyContent='center'>
                    <Chakra.Box w='33%' p='2%' bg='white'>
                        <Chakra.Text fontSize='.9vw'><b>Welcome Teacher!</b> | Enter your login credentials.</Chakra.Text>
                        <Chakra.Box w='100%' h='.1vw' mt='.5%' bg='#094333'></Chakra.Box>
                        <form onSubmit={(e) => handleLogin({ e, emailRef, passwordRef, login, navigate, setLoading, showToast })} style={{ w: '100%' }}>
                            <Chakra.FormLabel mt='4%' mb='0%' fontSize='.8vw'>Email:</Chakra.FormLabel>
                            <Chakra.InputGroup h='2.3vw' display='flex' alignItems='center'>
                                <Chakra.Input type='email' required h='100%' fontSize='.8vw' placeholder='Enter your email address' borderRadius='0' ref={emailRef} />
                                <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1vw' color='gray.500'><TiMail /></Chakra.Text> </Chakra.InputRightElement>
                            </Chakra.InputGroup>
                            <Chakra.FormLabel m='3% 0 0 0' fontSize='.8vw'>Password:</Chakra.FormLabel>
                            <Chakra.InputGroup h='2.3vw' display='flex' alignItems='center'>
                                <Chakra.Input type='password' required h='100%' fontSize='.8vw' placeholder='Enter your password' borderRadius='0' ref={passwordRef} />
                                <Chakra.InputRightElement h='100%'><Chakra.Text fontSize='1.1vw' color='gray.500'><TiLockClosedOutline /></Chakra.Text> </Chakra.InputRightElement>
                            </Chakra.InputGroup>
                            <Chakra.Button type='submit' isLoading={loading} isDisabled={loading} w='100%' h='2.2vw' mt='7%' fontSize='.8vw' color='white' bg='#e38a2b' rightIcon={<TiArrowRightThick />} borderRadius='0'>Continue</Chakra.Button>
                            <Chakra.Box w='100%' mt='1.7%' display='flex' justifyContent='center'>
                                <Chakra.Tooltip hasArrow label='reset your password' fontSize='.8vw' placement='auto-start'>
                                    <Chakra.Text onClick={() => navigate('/forgot-password')} fontSize='.8vw' fontWeight='400' textAlign='center' color='gray.700' cursor='pointer'>Forgot password?</Chakra.Text>
                                </Chakra.Tooltip>
                            </Chakra.Box>
                        </form>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' mt='2%' mb='2.5%' p='.4%' display='flex' alignItems='center' justifyContent='center'>
                    <Chakra.Box w='100%' bg='rgba(255, 255, 255, .7)' p='2%'>
                        {sliderLoading ? (
                            <Chakra.Box w="100%" display="flex" justifyContent="center" alignItems="center">
                                <Chakra.Spinner w='1vw' h='1vw' thickness='.1vw' />
                                <Chakra.Text ml="1vw" fontSize='.9vw' fontStyle='italic'>Loading...</Chakra.Text>
                            </Chakra.Box>
                        ) : (
                            <>
                                {
                                    imageUrls.length === 0 ? (
                                        <Chakra.Box w='100%' mt='.1vw' mb='1vw' pt='1vw' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                                            <Chakra.Text fontSize='.9vw' fontStyle='italic'>No images found.</Chakra.Text>
                                        </Chakra.Box>
                                    ) : (
                                        <Slider {...settings}>
                                            {imageUrls.map((imgSrc, index) => (
                                                <Chakra.Box key={index} w="100%" display="flex" alignItems="center" justifyContent="center">
                                                    <Chakra.Image objectFit='contain' src={imgSrc} alt={`image${index + 1}`} w="100%" h="25vw" />
                                                </Chakra.Box>
                                            ))}
                                        </Slider>
                                    )
                                }
                            </>
                        )}
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' mt='1%' p='0 .4% 0 .4%'>
                    <Chakra.Box w='100%' display='flex' justifyContent='space-between'>
                        <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .1)'>
                            <Chakra.Text as="h1" mb='.5%' fontSize='.8vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Mission <Chakra.Text ml='1.5%'><Rocket size='.9vw' /></Chakra.Text></Chakra.Text>
                            <Chakra.Text mt='2.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'>To protect and promote the right of every Filipino to qualify, equitable, culture-based and complete basic education where;</Chakra.Text>
                            <Chakra.Text mt='2%' fontSize='.8vw' p='0 3% 0 5%' textAlign='justify'> <b>STUDENTS</b> learn in a child-friendly, gender-senitive, safe and motivating environment.</Chakra.Text>
                            <Chakra.Text mt='2%' fontSize='.8vw' p='0 3% 0 5%' textAlign='justify'> <b>TEACHERS</b> facilitate learning and constantly nurture every learner.</Chakra.Text>
                            <Chakra.Text mt='2%' fontSize='.8vw' p='0 3% 0 5%' textAlign='justify'> <b>ADMINISTRATORS and STAFF</b> as stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.</Chakra.Text>
                            <Chakra.Text mt='2%' fontSize='.8vw' p='0 3% 0 5%' textAlign='justify'> <b>FAMILY, COMMUNITY, and other STAKEHOLDERS</b> are actively engaged and share responsibility for developing life-long learners.</Chakra.Text>
                        </Chakra.Box>
                        <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .1)'>
                            <Chakra.Text as="h1" mb='.5%' fontSize='.8vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Vision <Chakra.Text ml='1.5%'><MessageCircleHeart size='.9vw' /></Chakra.Text></Chakra.Text>
                            <Chakra.Text mt='2.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'>We dream of Filipinos who passionately love thier country and whose values and competencies enable them to realize thier full potential and contribute meaningfully to building the nation.</Chakra.Text>
                            <Chakra.Text mt='1.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'>As a learner-centered public institution the Department of Education continuously improves itself to better serve its stakeholders.</Chakra.Text>
                        </Chakra.Box>
                        <Chakra.Box w='32%' bg='white' p='1% 1% 2% 1%' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .1)'>
                            <Chakra.Text as="h1" mb='.5%' fontSize='.8vw' fontWeight='bold' color='white' bg='#094333' p='1% 2.5% 1% 2.5%' display='flex' alignItems='center'>Core Values <Chakra.Text ml='1.5%'><HeartHandshake size='.9vw' /></Chakra.Text></Chakra.Text>
                            <Chakra.Text mt='2.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-diyos</b></Chakra.Text>
                            <Chakra.Text mt='1.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-tao</b></Chakra.Text>
                            <Chakra.Text mt='1.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-kalikasan</b></Chakra.Text>
                            <Chakra.Text mt='1.5%' fontSize='.8vw' p='0 3% 0 3%' textAlign='justify'> <b>• Maka-bansa</b></Chakra.Text>
                        </Chakra.Box>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' mt='2.5%' p='.4%'>
                    <Chakra.Box w='100%' p='.4% .4% .4% .6%' bg='#094333' display='flex' alignItems='center'>
                        <Chakra.Text color='white' mr='.3%'><Mails strokeWidth='.2vw' size='.7vw' /></Chakra.Text>
                        <Chakra.Text fontSize='.7vw' fontWeight='700' color='white'>UPDATES</Chakra.Text>
                    </Chakra.Box>
                </Chakra.Box>
                <Chakra.Box w='100%' mb='2.5vw' p='1% .4% 1% .4%' display='flex' justifyContent='space-between'>
                    <Chakra.Box w='100%' display='flex' flexWrap="wrap" justifyContent='space-between'>
                        {updates.length === 0 ? (
                            <Chakra.Text fontSize='.9vw' ml='.4%'>No updates available</Chakra.Text>
                        ) : (
                            updates.map((update, index) => (
                                <Chakra.Card key={index} w='49.3%' p='1.5vw' borderRadius='0' boxShadow='.3vw .3vw .3vw rgb(105, 126, 116, .1)'>
                                    <Chakra.Heading mb='.8%' fontSize='1vw' textAlign='justify' textTransform='capitalize'>{update.header}</Chakra.Heading>
                                    <hr />
                                    <Chakra.Box w='100%' mt='1%'>
                                        <Chakra.Box w='100%' fontSize='.9vw'>
                                            <Chakra.Text fontSize='.9vw' mt='.3vw' pl='1vw' pr='1vw' textAlign='justify' style={{ whiteSpace: 'pre-wrap' }}>{update.content}</Chakra.Text>
                                        </Chakra.Box>
                                        <Chakra.Box w='100%' p='0 1vw 0 1vw' mt='1.5vw' display='flex' flexWrap="wrap" alignItems='center'>
                                            {update.images && update.images.length > 0 ? (
                                                update.images.map((imageUrl, imgIndex) => (
                                                    <Chakra.Image key={imgIndex} h='10vw' m='.1vw' objectFit='cover' src={imageUrl} alt={`Update Image ${imgIndex + 1}`} border='.1vw solid rgba(0, 0, 0, 0.43)' _hover={{ boxShadow: '.3vw .3vw .3vw rgb(105, 126, 116, .3)', transition: '.3s' }} transition='.3s' />
                                                ))
                                            ) : (
                                                <Chakra.Text mb='.8%' fontSize='.8vw' fontStyle='italic'></Chakra.Text>
                                            )}
                                        </Chakra.Box>
                                    </Chakra.Box>
                                    <hr />
                                    <Chakra.Text mt='1.5vw' pl='1vw' pr='1vw' fontSize='.7vw' fontStyle='italic'><b>Date Posted:</b> {update.timestamp ? new Date(update.timestamp).toLocaleDateString() : 'Unknown'}</Chakra.Text>
                                </Chakra.Card>
                            ))
                        )}
                    </Chakra.Box>
                </Chakra.Box>
            </Chakra.Box>
        </Chakra.Box>
    )
}
